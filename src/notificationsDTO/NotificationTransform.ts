import { INotificationDocument, NotificationDTO } from "./types";

export function transformToNotificationDTO(notification: INotificationDocument): NotificationDTO {
	return {
		sourceUserId: notification.sourceUserId.toString(),
		type: notification.type,
		title: notification.title,
		content: notification.content,
		status: notification.status,
		link: notification.link,
		createdAt: notification.createdAt.toISOString(),
	};
}