// Fluent UI (Microsoft의 Windows 11 디자인 시스템) 컴포넌트를 서버 렌더링해서
// 정적 HTML로 내보내는 스크립트입니다.
// 내보낸 결과물(out/)은 public/ 으로 복사한 뒤 손으로 수정했습니다.
// 다시 실행하면 out/ 만 덮어쓰며, public/ 은 건드리지 않습니다.
//
//   npm install
//   node export.js

const fs = require('fs');
const path = require('path');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const {
  FluentProvider,
  webLightTheme,
  createDOMRenderer,
  RendererProvider,
  renderToStyleElements,
  SSRProvider,
  Card,
  CardHeader,
  CardPreview,
  Text,
  Title1,
  Title3,
  Subtitle2,
  Body1,
  Caption1,
  Badge,
  Divider,
  Button,
  Link,
} = require('@fluentui/react-components');

const h = React.createElement;
const members = require('./members.json');

function Nav({ active }) {
  return h(
    'header',
    { className: 'pv-nav' },
    h('div', { className: 'pv-logo', 'aria-hidden': 'true' }),
    h(Subtitle2, null, 'Playverse'),
    h(
      'nav',
      { className: 'pv-nav-links' },
      h(Button, { as: 'a', href: '/', appearance: active === 'home' ? 'secondary' : 'subtle' }, '홈'),
      h(Button, { as: 'a', href: '/members', appearance: active === 'members' ? 'secondary' : 'subtle' }, '멤버'),
    ),
  );
}

function HomePage() {
  return h(
    'div',
    { className: 'pv-page' },
    h(Nav, { active: 'home' }),
    h(
      'main',
      { className: 'pv-main' },
      h(
        Card,
        { className: 'pv-hero' },
        h('div', { className: 'pv-logo pv-logo-lg', 'aria-hidden': 'true' }),
        h(Title1, { as: 'h1' }, 'Playverse'),
        h(Body1, null, '플레이버스'),
        h(Button, { as: 'a', href: '/members', appearance: 'primary' }, '멤버 소개 보기'),
      ),
    ),
  );
}

function Row({ label, value }) {
  return h(
    'div',
    { className: 'pv-row' },
    h(Caption1, { className: 'pv-row-label' }, label),
    h(Body1, { className: 'pv-row-value' }, value),
  );
}

function MemberCard({ m }) {
  return h(
    Card,
    { className: 'pv-member', id: m.id },
    h(
      CardPreview,
      { className: 'pv-member-preview' },
      h('img', { src: m.image, alt: m.callName + ' 캐릭터 이미지', loading: 'lazy' }),
    ),
    h(CardHeader, {
      header: h(Title3, { as: 'h2' }, m.name),
      description: h(Caption1, null, m.callName),
      action: h(Badge, { appearance: 'outline' }, m.colorHex),
    }),
    h(Divider, null),
    h(
      'div',
      { className: 'pv-rows' },
      h(Row, { label: '나이', value: m.age }),
      h(Row, { label: '생일', value: m.birthday }),
      h(Row, { label: '성별', value: m.gender }),
      h(Row, { label: '퍼스널 컬러', value: m.colorName }),
    ),
    m.rp ? h(Divider, null) : null,
    m.rp ? h(Body1, { className: 'pv-rp' }, m.rp) : null,
  );
}

function MembersPage() {
  return h(
    'div',
    { className: 'pv-page' },
    h(Nav, { active: 'members' }),
    h(
      'main',
      { className: 'pv-main' },
      h(Title1, { as: 'h1' }, '멤버'),
      h('div', { className: 'pv-grid' }, members.map((m) => h(MemberCard, { key: m.id, m }))),
    ),
  );
}

function render(Page, title) {
  const renderer = createDOMRenderer();
  const body = renderToStaticMarkup(
    h(
      RendererProvider,
      { renderer },
      h(SSRProvider, null, h(FluentProvider, { theme: webLightTheme }, h(Page))),
    ),
  );
  const styles = renderToStaticMarkup(h(React.Fragment, null, renderToStyleElements(renderer)));
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
${styles}
</head>
<body>
${body}
</body>
</html>
`;
}

const out = path.join(__dirname, 'out');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), render(HomePage, 'Playverse'));
fs.writeFileSync(path.join(out, 'members.html'), render(MembersPage, '멤버 · Playverse'));
console.log('exported to', out);
