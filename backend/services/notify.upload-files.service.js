const config = require('../config');

function notifyUploadFiles(customerCode, source, files, folderName) {
    if (!customerCode || !config.mandrill.dropboxNotifyTo) {
        return;
    }

    let filesList = '';

    for (const property in files) {
        filesList += `<li align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding: 5px;">${files[property]}</li>`
    }

    const html = `
        <!doctype html>
        <html>
            <head>
                <meta name="viewport" content="width=device-width" />
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            </head>
            <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
                <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
                    <tr>
                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; padding: 20px; max-width: 768px; width: 768px;">
                            <!-- PREHEADER -->
                            <span style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">Bonjour, </span>
                            <!-- START CENTERED WHITE CONTAINER -->
                            <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px; padding-bottom: 1em;">
                                <!-- START MAIN CONTENT AREA -->
                                <tr>
                                    <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                                        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                            <tr>
                                                <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                                                    <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">
                                                        Partenaire : ${customerCode}
                                                    </p>
                                                    <p>
                                                        Dossier : ${folderName}
                                                    </p>
                                                    <p>
                                                        Fichiers :
                                                    </p>
                                                    <ul>
                                                        ${filesList}
                                                    </ul>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- END MAIN CONTENT AREA -->
                            </table>
                            <!-- START FOOTER AREA -->
                            <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                <tr style="background-color: #1c1819;">
                                    <td style="font-family: sans-serif; vertical-align: top; padding: 20px; font-size: 12px; color: white; align: left; width: 33.33%;">
                                        <img src="https://www.etre-visible.local.fr/userfiles/6817/local-fr.png" title="logo local.fr" width="100px" />
                                    </td>
                                    <td style="font-family: sans-serif; vertical-align: center; padding: 20px; font-size: 12px; color: white; text-align: center;">
                                        Envoyé depuis <a href="https://localetmoi.fr" style="color: white; text-decoration: none;">Local&moi</a>
                                    </td>
                                    <td style="font-family: sans-serif; vertical-align: top; padding: 20px; font-size: 12px; color: white; text-align: center; width: 33.33%;"></td>
                                </tr>
                            <!-- END FOOTER AREA -->
                            </table>
                            <!-- END CENTERED WHITE CONTAINER -->
                        </td>
                    </tr>
                </table>
            </body>
        </html>`;

    return {
        'key': config.mandrill.apiKey,
        'message': {
            'from_email': config.mandrill.mailFrom,
            'to': [
                ...config.mandrill.dropboxNotifyTo ? config.mandrill.dropboxNotifyTo.split(',').map(email => {
                    return {
                        'email': email,
                        'type': 'to'
                    };
                }) : [],
                ...config.mandrill.dropboxNotifyCc ? config.mandrill.dropboxNotifyCc.split(',').map(email => {
                    return {
                        'email': email,
                        'type': 'cc'
                    };
                }) : []
            ],
            'autotext': 'true',
            'subject': `Dépôt d'éléments ${getSourceLabelEmail(source)}`,
            'html': html
        }
    };
}

function getSourceLabelEmail(source) {
    let labelEmail = '';

    switch (source) {
        case 'ticket':
            labelEmail = "via un ticket";
            break;
        case 'drop-element':
            labelEmail = "via l'espace partagé";
            break;
    }

    return `${labelEmail}`;
}

module.exports = notifyUploadFiles;
