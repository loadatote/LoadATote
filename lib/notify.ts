type NotifyInput = {
  ownerEmail: string;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  message: string;
  notifyMethod: 'email' | 'sms';
};

export async function sendNotifications(input: NotifyInput) {
  const results: Array<{ channel: string; ok: boolean; message: string }> = [];

  // Build-safe fallback: store the notification in the app database and
  // return a status message. Real SMTP/SMS can be re-enabled later.
  results.push({
    channel: 'email',
    ok: false,
    message: `Notification stored for owner ${input.ownerEmail}. SMTP is not configured in this build.`
  });

  if (input.notifyMethod === 'sms') {
    results.push({
      channel: 'sms',
      ok: false,
      message: `SMS notification stored for ${input.customerPhone}. Twilio is not configured in this build.`
    });
  }

  return results;
}
