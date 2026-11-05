# Playverse 플레이버스

팀 웹사이트입니다. Cloudflare Pages에 그대로 올리는 정적 사이트입니다.

## Cloudflare Pages 설정

- Framework preset: `None`
- Build command: 비워두기
- Build output directory: `public`

`/members` 주소는 Cloudflare Pages가 `members.html`로 자동 연결합니다.

## 구조

- `public/` — 배포되는 사이트 (index.html, members.html, site.css, images/)
- `tools/fluent-export/` — 페이지 뼈대를 만든 도구

## 만든 방법

1. `tools/fluent-export/export.js`가 Microsoft Fluent UI(Windows 11 디자인 시스템) 컴포넌트를 서버 렌더링해 `out/`에 HTML로 내보냅니다.
2. 내보낸 HTML을 `public/`에 복사한 뒤 직접 수정했습니다 (글꼴에 맑은 고딕 추가, 퍼스널 컬러 견본, RP 세부 항목 등).

`export.js`를 다시 실행해도 `out/`만 바뀌고 `public/`은 그대로입니다.
멤버 정보 수정은 `public/members.html`을 직접 고치면 됩니다.

## 로고

아직 없습니다. 생기면 `class="pv-logo"` 자리(점선 상자)에 이미지를 넣으면 됩니다.
