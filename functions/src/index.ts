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
