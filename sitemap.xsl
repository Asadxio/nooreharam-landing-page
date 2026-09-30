<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>XML Sitemap | NOOR-E-HARAM</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #032319;
            color: #E2E8F0;
            margin: 0;
            padding: 30px 20px;
          }
          .container {
            max-width: 900px;
            margin: 0 auto;
            background: #063326;
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
          }
          h1 {
            color: #D4AF37;
            font-size: 24px;
            margin-top: 0;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          p {
            color: #94A3B8;
            font-size: 14px;
            line-height: 1.6;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 24px;
            font-size: 14px;
          }
          th {
            background-color: #04251B;
            color: #D4AF37;
            text-align: left;
            padding: 12px;
            border-bottom: 2px solid rgba(212, 175, 55, 0.4);
          }
          td {
            padding: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
          tr:hover td {
            background-color: rgba(212, 175, 55, 0.05);
          }
          a {
            color: #E2E8F0;
            text-decoration: none;
            word-break: break-all;
          }
          a:hover {
            color: #D4AF37;
            text-decoration: underline;
          }
          .badge {
            background: rgba(212, 175, 55, 0.15);
            color: #D4AF37;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
          }
          .footer {
            margin-top: 24px;
            font-size: 12px;
            color: #64748B;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>
            <span>🌙 NOOR-E-HARAM</span>
            <span style="font-size: 16px; color: #94A3B8; font-weight: normal;">| XML Sitemap</span>
          </h1>
          <p>
            Yeh XML Sitemap Google Search Console aur search engines ke liye generated hai taaki wo website ke sabhi live pages ko index kar sakein.
          </p>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Priority</th>
                <th>Change Frequency</th>
                <th>Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                  </td>
                  <td>
                    <span class="badge"><xsl:value-of select="sitemap:priority"/></span>
                  </td>
                  <td><xsl:value-of select="sitemap:changefreq"/></td>
                  <td><xsl:value-of select="sitemap:lastmod"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
          <div class="footer">
            Generated for NOOR-E-HARAM (https://nooreharam.com) • Standard sitemaps.org protocol
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
