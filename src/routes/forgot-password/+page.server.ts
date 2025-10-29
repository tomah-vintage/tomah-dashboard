import type { Actions } from './$types';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const actions: Actions = {
	default: async ({ request }) => {
		try {
			const data = await request.formData();
			const email = data.get('email') as string;

			if (!email) {
				return {
					success: false,
					message: 'Имэйл хаяг шаардлагатай'
				};
			}

			// Call backend API for password reset OTP request
			const response = await fetch(`${PUBLIC_BACKEND_URL}/api/password-reset/request/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
			});

			const result = await response.json();

			if (response.ok) {
				return {
					success: true,
					message: `Нууц үг сэргээх код таны имэйл рүү илгээлээ. Код ${result.expires_in_minutes} минутын дараа хүчингүй болно.`,
					email: email
				};
			} else {
				return {
					success: false,
					message: result.error === 'User not found' ? 'Энэ имэйл хаягтай хэрэглэгч олдсонгүй' : 'Алдаа гарлаа'
				};
			}
		} catch (error) {
			console.error('Forgot password error:', error);
			return {
				success: false,
				message: 'Сервертэй холбогдоход алдаа гарлаа'
			};
		}
	}
};