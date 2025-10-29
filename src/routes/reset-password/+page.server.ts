import type { Actions } from './$types';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const actions: Actions = {
	default: async ({ request }) => {
		try {
			const data = await request.formData();
			const email = data.get('email') as string;
			const otp_code = data.get('otp_code') as string;
			const new_password = data.get('new_password') as string;
			const confirm_password = data.get('confirm_password') as string;

			// Validation
			if (!email || !otp_code || !new_password || !confirm_password) {
				return {
					success: false,
					message: 'Бүх талбарыг бөглөнө үү'
				};
			}

			if (new_password !== confirm_password) {
				return {
					success: false,
					message: 'Нууц үг таарахгүй байна'
				};
			}

			// Call backend API for password reset confirmation
			const response = await fetch(`${PUBLIC_BACKEND_URL}/api/password-reset/confirm/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					otp_code,
					new_password,
					confirm_password
				})
			});

			const result = await response.json();

			if (response.ok) {
				return {
					success: true,
					message: 'Нууц үг амжилттай шинэчлэгдлээ. Одоо шинэ нууц үгээрээ нэвтэрч болно.'
				};
			} else {
				let errorMessage = 'Алдаа гарлаа';
				
				if (result.error === 'Invalid OTP code') {
					errorMessage = 'Буруу баталгаажуулах код';
				} else if (result.error === 'OTP has expired') {
					errorMessage = 'Баталгаажуулах кодын хугацаа дууссан';
				} else if (result.error === 'Passwords do not match.') {
					errorMessage = 'Нууц үг таарахгүй байна';
				} else if (result.error) {
					errorMessage = result.error;
				}

				return {
					success: false,
					message: errorMessage
				};
			}
		} catch (error) {
			console.error('Password reset confirmation error:', error);
			return {
				success: false,
				message: 'Сервертэй холбогдоход алдаа гарлаа'
			};
		}
	}
};