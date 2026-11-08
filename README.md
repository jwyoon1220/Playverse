# Playverse 플레이버스

팀 웹사이트입니다. 서버 코드나 데이터베이스 없이 `public/` 폴더의 정적 파일만 배포합니다.

## 배포 (Cloudflare Workers 정적 자산)

`wrangler.toml`에 정적 파일 폴더(`./public`)만 지정되어 있습니다.

```bash
npx wrangler deploy
```

`/members` 주소는 `members.html`로 연결됩니다.

## 구조

- `public/` — 배포되는 사이트 (index.html, members.html, site.css, images/, 파비콘)
- `tools/fluent-export/` — 페이지 뼈대를 만드는 도구와 멤버 데이터(`members.json`)

## 멤버 추가·수정

1. `public/images/members/`에 이미지를 넣습니다 (webp 권장).
2. `tools/fluent-export/members.json`을 고칩니다.
3. 생성기를 실행합니다.

   ```bash
   cd tools/fluent-export && npm install && node export.js
   ```

4. `out/members.html`을 `public/members.html`로 복사한 뒤, 기존 파일처럼 `<head>` 부분을 손봅니다.
   - 글꼴 변수(`--fontFamilyBase`, `--fontFamilyNumeric`)를 `'Noto Sans KR', sans-serif`로 바꿉니다.
   - Google Fonts, 파비콘, `site.css` 링크를 넣습니다.

## 만든 방법

`tools/fluent-export/export.js`가 Microsoft Fluent UI(Windows 11 디자인 시스템) 컴포넌트를 HTML로 내보냅니다. 그 HTML을 `public/`에 복사해서 직접 손봤습니다. 레이아웃은 `public/site.css`에 있고, microsoft.com의 Windows 11 소개 페이지 구성을 참고했습니다.
