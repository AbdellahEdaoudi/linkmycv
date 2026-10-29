export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/dashboard', '/api'],
      },
    ],
    sitemap: 'https://linkmycv.site/sitemap.xml',
    host: 'https://linkmycv.site',
  };
}

