Certain Roofing - static HTML version
=====================================

Upload the CONTENTS of this folder (including the hidden .htaccess file) to the web root of the
site, or to any subfolder for a staging preview. All links are relative.

All 23 URLs are unchanged: home, about, services and the 5 service pages (roof replacement &
repair, storm damage & insurance restoration, siding installation & replacement, kitchen
remodeling, interior remodeling & home improvement), portfolio and its 6 projects, the blog and
its 6 posts, and contact. Each URL is a folder containing index.html.

Contact form
------------
The Contact Form 7 form on /contact/ now posts to send.php (needs PHP) and shows the usual
"Thank you for your message" after sending. It sends name, phone, email, city, topic and
message to info@CertainRoofing.com (the address shown on the site); change $to in send.php
to use another address. A hidden honeypot field adds basic spam protection.

Noindex
-------
Every page has <meta name="robots" content="noindex, nofollow" /> (as on the current staging
site) and .htaccess sends an X-Robots-Tag: noindex, nofollow header.
BEFORE GOING LIVE on the real domain: remove that meta line from each page and delete the
"BEGIN noindex ... END noindex" block from .htaccess, or the site will not appear in Google.
