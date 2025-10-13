import { notification } from "antd";

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export function useAppNotification() {
	const [api, contextHolder] = notification.useNotification();

	const open = (
		type: NotificationType,
		opts?: { message?: string; description?: string; duration?: number }
	) => {
		api[type]({
			message: opts?.message ?? "Notification",
			description: opts?.description ?? "",
			duration: opts?.duration ?? 4.5,
		});
	};

	return { api, contextHolder, open };
}