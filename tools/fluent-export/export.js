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
    h(
      'div',
      { className: 'pv-nav-inner' },
      h(
        'a',
        { className: 'pv-brand', href: '/' },
        h('span', { className: 'pv-logo', 'aria-hidden': 'true' }),
        h('span', { className: 'pv-brand-name' }, 'Playverse'),
      ),
      h(
        'nav',
        { className: 'pv-nav-links' },
        h('a', { href: '/', className: active === 'home' ? 'is-active' : '' }, '홈'),
        h('a', { href: '/members', className: active === 'members' ? 'is-active' : '' }, '멤버'),
      ),
    ),
  );
}

function Footer() {
  return h(
    'footer',
    { className: 'pv-footer' },
    h('div', { className: 'pv-footer-inner' }, h(Caption1, null, '© 2026 Playverse')),
  );
}

function HomePage() {
  return h(
    'div',
    { className: 'pv-page' },
    h(Nav, { active: 'home' }),
    h(
      'main',
      null,
      h(
        'section',
        { className: 'pv-hero' },
        h(
          'div',
          { className: 'pv-hero-inner' },
          h(
            'div',
            { className: 'pv-hero-media' },
            members.map((m) =>
              h('div', { key: m.id, className: 'pv-tile', style: { background: m.colorHex } },
                h('img', { src: m.image, alt: '' })),
            ),
          ),
          h(
            'div',
            { className: 'pv-hero-text' },
            h('h1', { className: 'pv-display' }, '플레이버스', h('br'), 'Playverse'),
            h(Body1, { as: 'p', className: 'pv-lead' }, '플레이버스 팀 웹사이트입니다.'),
            h(Button, { as: 'a', href: '/members', appearance: 'primary', size: 'large' }, '멤버 소개 보기'),
          ),
        ),
      ),
      h(
        'section',
        { className: 'pv-section' },
        h('h2', { className: 'pv-section-title' }, '멤버'),
        h(
          'div',
          { className: 'pv-cards' },
          members.map((m) =>
            h(
              'a',
              { key: m.id, className: 'pv-card', href: '/members#' + m.id },
              h('div', { className: 'pv-card-media', style: { background: m.colorHex } },
                h('img', { src: m.image, alt: m.callName + ' 캐릭터 이미지', loading: 'lazy' })),
              h('h3', { className: 'pv-card-title' }, m.name),
              h(Body1, { as: 'p', className: 'pv-card-text' }, m.callName + ' · ' + m.rp),
            ),
          ),
        ),
      ),
    ),
    h(Footer),
  );
}

function Info({ label, value }) {
  return h('div', { className: 'pv-info' }, h('dt', null, label), h('dd', null, value));
}

function MemberSection({ m, i }) {
  return h(
    'section',
    { className: 'pv-member' + (i % 2 ? ' is-reverse' : ''), id: m.id },
    h('div', { className: 'pv-member-media', style: { background: m.colorHex } },
      h('img', { src: m.image, alt: m.callName + ' 캐릭터 이미지', loading: i ? 'lazy' : 'eager' })),
    h(
      'div',
      { className: 'pv-member-text' },
      h('h2', { className: 'pv-member-name' }, m.name),
      h('p', { className: 'pv-member-call' }, m.callName, m.aside ? h('span', { className: 'pv-aside' }, ' · ' + m.aside) : null),
      h('dl', { className: 'pv-infos' },
        h(Info, { label: '나이', value: m.age }),
        h(Info, { label: '생일', value: m.birthday }),
        h(Info, { label: '성별', value: m.gender }),
        h(Info, {
          label: '퍼스널 컬러',
          value: h(React.Fragment, null, h('span', { className: 'pv-swatch', style: { background: m.colorHex } }), m.colorName === m.colorHex ? m.colorHex : m.colorName + ' ' + m.colorHex),
        }),
      ),
      h('div', { className: 'pv-rp' },
        h('p', { className: 'pv-rp-label' }, 'RP'),
        h('p', { className: 'pv-rp-text' }, m.rp),
        m.extras.length ? h('dl', { className: 'pv-infos pv-infos-sm' }, m.extras.map(([k, v]) => h(Info, { key: k, label: k, value: v }))) : null,
        m.notes.length ? h('ul', { className: 'pv-notes' }, m.notes.map((n) => h('li', { key: n }, n))) : null,
      ),
    ),
  );
}

function MembersPage() {
  return h(
    'div',
    { className: 'pv-page' },
    h(Nav, { active: 'members' }),
    h(
      'main',
      null,
      h('section', { className: 'pv-hero pv-hero-sm' },
        h('div', { className: 'pv-hero-inner pv-hero-inner-sm' },
          h('h1', { className: 'pv-display' }, '멤버'),
          h(Body1, { as: 'p', className: 'pv-lead' }, 'Playverse 멤버를 소개합니다.'),
          h('nav', { className: 'pv-jump' }, members.map((m) =>
            h(Button, { key: m.id, as: 'a', href: '#' + m.id, shape: 'circular' }, m.callName))),
        )),
      h('div', { className: 'pv-members' }, members.map((m, i) => h(MemberSection, { key: m.id, m, i }))),
    ),
    h(Footer),
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
