- 生产环境（Production）
触发方式: 推送到GitHub的main分支
部署方式: Cloudflare Pages自动部署
前端URL: https://getyourluck-testing-platform.pages.dev
后端URL: https://api.selfatlas.net


- 预览环境（Preview/Staging）
触发方式: 推送到GitHub的任何feature分支
部署方式: Cloudflare Pages自动为每个分支创建预览部署
前端URL: https://[hash].getyourluck-testing-platform.pages.dev
后端URL: https://selfatlas-backend-staging.cyberlina.workers.dev


- 后端部署方式
生产环境: 通过wrangler deploy --env=production手动部署
Staging环境: 通过wrangler deploy --env=staging手动部署
本地环境: 通过wrangler dev本地开发