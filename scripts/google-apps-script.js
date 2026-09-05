/**
 * Google Apps Script for Synchronizing Google Doc CV with Portfolio Website
 *
 * HOW TO INSTALL IN YOUR GOOGLE DOC:
 * 1. Open your Google Doc: https://docs.google.com/document/d/12xqyy8FcXRNRNAFbrTG0OrNwciBWKp4C1o6pOP3JzPo/edit
 * 2. In the top menu, click: Extensions > Apps Script
 * 3. Delete any code in the editor and paste this entire script.
 * 4. Update WEBHOOK_URL (your production domain or ngrok/tunnel URL) and SYNC_SECRET.
 * 5. Click the Save icon (💾).
 * 6. Refresh your Google Doc. A new menu item "Portfolio Sync" will appear at the top!
 * 7. Click: Portfolio Sync > 🚀 Sync to Website Now
 *
 * (Optional) FOR AUTOMATIC SCHEDULED SYNC:
 * In Apps Script left sidebar, click Triggers (clock icon) > Add Trigger:
 * - Function: syncCvToWebsite
 * - Event source: Time-driven
 * - Type: Hour timer (e.g., Every 12 hours or Day timer)
 */

// =================== CONFIGURATION ===================
const CONFIG = {
  // Replace with your production domain (e.g. https://abdullahomar.com)
  WEBHOOK_URL: "https://abdullahomar.com/api/sync-cv",
  // Must match CV_SYNC_SECRET in your .env.local
  SYNC_SECRET: "209ea401d922a76168d2476c16cf1dfac2d5dcaaa0a05b7d",
  DOC_ID: "12xqyy8FcXRNRNAFbrTG0OrNwciBWKp4C1o6pOP3JzPo",
};
// =====================================================

/**
 * Adds a custom menu when opening the Google Doc
 */
function onOpen() {
  const ui = DocumentApp.getUi();
  ui.createMenu("Portfolio Sync")
    .addItem("🚀 Sync to Website Now", "syncCvToWebsite")
    .addSeparator()
    .addItem("ℹ️ Test Connection", "testWebhookConnection")
    .addToUi();
}

/**
 * Main synchronization function
 */
function syncCvToWebsite() {
  const doc = DocumentApp.getActiveDocument();
  const ui = DocumentApp.getUi();

  doc.toast("Connecting to website and analyzing CV with Gemini AI...", "Syncing CV", 10);

  try {
    const rawText = doc.getBody().getText();
    const docId = doc.getId() || CONFIG.DOC_ID;

    const payload = JSON.stringify({
      docId: docId,
      rawText: rawText,
    });

    const options = {
      method: "post",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + CONFIG.SYNC_SECRET,
        "x-sync-secret": CONFIG.SYNC_SECRET,
      },
      payload: payload,
      muteHttpExceptions: true,
    };

    const response = UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(responseText);
    } catch (e) {
      jsonResponse = { message: responseText };
    }

    if (responseCode === 200 && jsonResponse.success) {
      const counts = jsonResponse.data?.counts || {};
      const msg =
        "✅ Website updated successfully!\n\n" +
        "• Experiences updated: " + (counts.experiences || 0) + "\n" +
        "• Skills updated: " + (counts.skills || 0) + "\n" +
        "• Education updated: " + (counts.education || 0);

      ui.alert("Sync Complete", msg, ui.ButtonSet.OK);
      doc.toast("Sync completed successfully!", "Done", 5);
    } else {
      ui.alert(
        "Sync Failed",
        "Server returned HTTP " + responseCode + ":\n" + (jsonResponse.message || responseText),
        ui.ButtonSet.OK
      );
    }
  } catch (error) {
    ui.alert("Sync Error", "An error occurred while syncing: " + error.toString(), ui.ButtonSet.OK);
  }
}

/**
 * Quick connection check
 */
function testWebhookConnection() {
  const ui = DocumentApp.getUi();

  try {
    const options = {
      method: "get",
      headers: {
        Authorization: "Bearer " + CONFIG.SYNC_SECRET,
      },
      muteHttpExceptions: true,
    };

    const response = UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, options);
    const responseCode = response.getResponseCode();

    if (responseCode === 200) {
      ui.alert("Connection Successful", "Successfully connected to Portfolio Sync API (HTTP 200).", ui.ButtonSet.OK);
    } else {
      ui.alert("Connection Failed", "Received HTTP " + responseCode + ":\n" + response.getContentText(), ui.ButtonSet.OK);
    }
  } catch (error) {
    ui.alert("Connection Error", error.toString(), ui.ButtonSet.OK);
  }
}
