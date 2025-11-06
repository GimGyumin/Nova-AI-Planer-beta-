import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();

// 이메일 발송 설정
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface InviteRequest {
  folderId: string;
  folderName: string;
  inviteeEmail: string;
  inviterEmail: string;
  role: "editor" | "viewer";
}

// 협업자 초대 함수

// 마감일 알림 스케줄러 (매시간 실행)
export const checkDeadlineNotifications = functions
  .region("asia-northeast1")
  .pubsub.schedule("0 * * * *") // 매시간 정각에 실행
  .timeZone("Asia/Seoul")
  .onRun(async (context) => {
    try {
      console.log("⏰ 마감일 알림 체크 시작");
      
      // 모든 사용자의 목표 데이터 가져오기
      const usersSnapshot = await admin.firestore().collection("users").get();
      
      const now = new Date();
      let notificationsSent = 0;
      
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const userData = userDoc.data();
        
        // 사용자의 알림 설정 확인
        if (!userData.isDeadlineNotificationEnabled) {
          continue;
        }
        
        // 사용자의 목표들 가져오기
        const todosSnapshot = await admin
          .firestore()
          .collection("users")
          .doc(userId)
          .collection("todos")
          .where("completed", "==", false)
          .where("deadline", "!=", "")
          .get();
        
        for (const todoDoc of todosSnapshot.docs) {
          const todo = todoDoc.data();
          
          if (!todo.deadline || !todo.deadlineNotifications?.length) {
            continue;
          }
          
          const deadline = new Date(todo.deadline);
          const timeDiff = deadline.getTime() - now.getTime();
          
          // 각 알림 간격별로 체크
          for (const interval of todo.deadlineNotifications) {
            let shouldNotify = false;
            let notificationTitle = "";
            
            switch (interval) {
              case "1hour":
                shouldNotify = timeDiff <= 3600000 && timeDiff > 0;
                notificationTitle = "⏰ 마감 1시간 전!";
                break;
              case "3hours":
                shouldNotify = timeDiff <= 10800000 && timeDiff > 3600000;
                notificationTitle = "⏰ 마감 3시간 전!";
                break;
              case "5hours":
                shouldNotify = timeDiff <= 18000000 && timeDiff > 10800000;
                notificationTitle = "⏰ 마감 5시간 전!";
                break;
              case "12hours":
                shouldNotify = timeDiff <= 43200000 && timeDiff > 18000000;
                notificationTitle = "⏰ 마감 12시간 전!";
                break;
              case "1day":
                shouldNotify = timeDiff <= 86400000 && timeDiff > 43200000;
                notificationTitle = "📅 마감 1일 전!";
                break;
              case "2days":
                shouldNotify = timeDiff <= 172800000 && timeDiff > 86400000;
                notificationTitle = "📅 마감 2일 전!";
                break;
              case "3days":
                shouldNotify = timeDiff <= 259200000 && timeDiff > 172800000;
                notificationTitle = "📅 마감 3일 전!";
                break;
              case "7days":
                shouldNotify = timeDiff <= 604800000 && timeDiff > 259200000;
                notificationTitle = "📅 마감 7일 전!";
                break;
            }
            
            if (shouldNotify) {
              // 중복 알림 방지 체크
              const notificationKey = `${userId}_${todo.id}_${interval}`;
              const today = now.toDateString();
              
              const lastNotificationDoc = await admin
                .firestore()
                .collection("notification_logs")
                .doc(notificationKey)
                .get();
              
              const lastNotified = lastNotificationDoc.data()?.date;
              
              if (lastNotified !== today) {
                // 사용자의 FCM 토큰 가져오기
                const userTokens = userData.fcmTokens || [];
                
                if (userTokens.length > 0) {
                  const message = {
                    notification: {
                      title: notificationTitle,
                      body: `"${todo.wish || todo.title}" 목표의 마감일이 다가오고 있습니다.`,
                      icon: "/favicon.ico",
                    },
                    data: {
                      todoId: todo.id,
                      type: "deadline_reminder",
                      interval: interval,
                    },
                    tokens: userTokens,
                  };
                  
                  // FCM 메시지 전송
                  const response = await admin.messaging().sendMulticast(message);
                  console.log(`📨 알림 전송: ${userId}, 성공: ${response.successCount}, 실패: ${response.failureCount}`);
                  
                  // 알림 로그 저장
                  await admin
                    .firestore()
                    .collection("notification_logs")
                    .doc(notificationKey)
                    .set({
                      userId,
                      todoId: todo.id,
                      interval,
                      date: today,
                      timestamp: admin.firestore.FieldValue.serverTimestamp(),
                    });
                  
                  notificationsSent++;
                }
              }
            }
          }
        }
      }
      
      console.log(`✅ 마감일 알림 체크 완료. 전송된 알림: ${notificationsSent}개`);
      return null;
    } catch (error) {
      console.error("❌ 마감일 알림 체크 실패:", error);
      throw error;
    }
  });

/**
 * 협업자 초대 이메일 발송 함수
 */
export const inviteCollaborator = functions
  .region("asia-northeast1")
  .https.onCall(
    async (data: InviteRequest, context) => {
      // 인증 확인
      if (!context.auth) {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "사용자 인증이 필요합니다."
        );
      }

      const { folderId, folderName, inviteeEmail, inviterEmail, role } = data;

      // 입력값 검증
      if (!folderId || !folderName || !inviteeEmail || !inviterEmail) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "필수 정보가 누락되었습니다."
        );
      }

      try {
        // 이메일 내용 생성
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: inviteeEmail,
          subject: `${inviterEmail}님이 "${folderName}" 폴더 협업에 초대했습니다`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Nova AI Planner 협업 초대</h2>
              <p style="color: #666; line-height: 1.6;">
                ${inviterEmail}님이 "<strong>${folderName}</strong>" 폴더 협업에 <strong>${role === "editor" ? "편집자" : "뷰어"}</strong>로 초대했습니다.
              </p>
              <p style="color: #666; line-height: 1.6;">
                아래 링크를 클릭하여 폴더에 접근할 수 있습니다:
              </p>
              <div style="margin: 20px 0;">
                <a href="${process.env.APP_URL || "https://gimgyumin.github.io/Nova-AI-Planer/"}" 
                   style="display: inline-block; padding: 12px 24px; background-color: #007AFF; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Nova AI Planner 열기
                </a>
              </div>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="color: #999; font-size: 12px;">
                이 이메일은 Nova AI Planner에서 자동으로 발송되었습니다.
              </p>
            </div>
          `,
        };

        // 이메일 발송
        await transporter.sendMail(mailOptions);

        // Firestore에 초대 기록 저장
        const inviteRef = admin
          .firestore()
          .collection("folder_invitations")
          .doc();
        await inviteRef.set({
          folderId,
          folderName,
          inviteeEmail,
          inviterEmail,
          role,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          status: "pending",
        });

        return {
          success: true,
          message: "초대 이메일이 발송되었습니다.",
        };
      } catch (error) {
        console.error("이메일 발송 실패:", error);
        throw new functions.https.HttpsError(
          "internal",
          `이메일 발송에 실패했습니다: ${
            error instanceof Error ? error.message : "알 수 없는 오류"
          }`
        );
      }
    }
  );

/**
 * 협업자 제거 함수
 */
export const removeCollaborator = functions
  .region("asia-northeast1")
  .https.onCall(
    async (
      data: { folderId: string; userId: string },
      context
    ) => {
      // 인증 확인
      if (!context.auth) {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "사용자 인증이 필요합니다."
        );
      }

      const { folderId, userId } = data;

      if (!folderId || !userId) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "필수 정보가 누락되었습니다."
        );
      }

      try {
        // 사용자의 폴더 문서에서 협업자 제거
        const folderRef = admin
          .firestore()
          .collection("users")
          .doc(context.auth.uid)
          .collection("folders")
          .doc(folderId);

        await folderRef.update({
          collaborators: admin.firestore.FieldValue.arrayRemove({
            userId: userId,
          }),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return {
          success: true,
          message: "협업자가 제거되었습니다.",
        };
      } catch (error) {
        console.error("협업자 제거 실패:", error);
        throw new functions.https.HttpsError(
          "internal",
          `협업자 제거에 실패했습니다: ${
            error instanceof Error ? error.message : "알 수 없는 오류"
          }`
        );
      }
    }
  );
