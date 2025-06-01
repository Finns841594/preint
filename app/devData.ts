export interface ServerEvent {
  id: string;
  timestamp: string;
  type: "API Request" | "User Login" | "System Update" | "ErrorLog";
  message: string;
  status: "success" | "error" | "info" | "warning";
}

const generateRandomEvent = (index: number): ServerEvent => {
  const types: ServerEvent["type"][] = [
    "API Request",
    "User Login",
    "System Update",
    "ErrorLog",
  ];
  const statuses: ServerEvent["status"][] = [
    "success",
    "error",
    "info",
    "warning",
  ];
  const messages = [
    "User '{user}' logged in from IP {ip}.",
    "API call to {endpoint} {status_verb}.",
    "System undergoing scheduled maintenance.",
    "Error processing payment for order {order_id}.",
    "New user registration: {email}.",
    "Data synchronization {sync_status}.",
    "Security alert: Unusual login attempt detected for user {user_id}.",
    "Service {service_name} restarted.",
    "Configuration updated for module {module_name}.",
    "Backup process {backup_status}.",
  ];
  const randomType = types[Math.floor(Math.random() * types.length)];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const randomMessageTemplate =
    messages[Math.floor(Math.random() * messages.length)];

  // Simple template replacement
  const populatedMessage = randomMessageTemplate
    .replace("{user}", `user_${Math.floor(Math.random() * 100)}`)
    .replace("{ip}", `192.168.1.${Math.floor(Math.random() * 255)}`)
    .replace(
      "{endpoint}",
      `/api/v${Math.ceil(Math.random() * 3)}/${["users", "products", "orders", "payments"][Math.floor(Math.random() * 4)]}`,
    )
    .replace(
      "{status_verb}",
      ["succeeded", "failed", "returned 200", "returned 404", "timed out"][
        Math.floor(Math.random() * 5)
      ],
    )
    .replace("{order_id}", `order_${Math.floor(Math.random() * 10000)}`)
    .replace("{email}", `test${Math.floor(Math.random() * 1000)}@example.com`)
    .replace(
      "{sync_status}",
      ["started", "completed", "failed"][Math.floor(Math.random() * 3)],
    )
    .replace("{user_id}", `usr_${Math.random().toString(36).substring(2, 10)}`)
    .replace(
      "{service_name}",
      ["AuthService", "PaymentGateway", "NotificationService"][
        Math.floor(Math.random() * 3)
      ],
    )
    .replace(
      "{module_name}",
      ["Inventory", "Reporting", "UserManagement"][
        Math.floor(Math.random() * 3)
      ],
    )
    .replace(
      "{backup_status}",
      ["initiated", "completed successfully", "failed with errors"][
        Math.floor(Math.random() * 3)
      ],
    );

  return {
    id: `evt-${String(index).padStart(3, "0")}`,
    timestamp: new Date(
      Date.now() - 1000 * 60 * Math.floor(Math.random() * 60 * 24),
    ).toISOString(), // Random time in last 24 hours
    type: randomType,
    message: populatedMessage,
    status: randomStatus,
  };
};

export const sampleEvents: ServerEvent[] = Array.from({ length: 50 }, (_, i) =>
  generateRandomEvent(i + 1),
);
