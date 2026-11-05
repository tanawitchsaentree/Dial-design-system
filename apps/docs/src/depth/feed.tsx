// Usage tab for Feed (component-depth.md U1–U14). Feed is a scrolling run of posts that loads more as you read.
import { Feed, FeedItem } from 'dial-react';
import type { Depth } from './types';

const Box = ({ children }: { children: React.ReactNode }) => (
  <div className="demo-box demo-card"><div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>{children}</div></div>
);
const three = () => (
  <Feed label="House activity">
    <FeedItem name="Mali Kaew" time="22:40">The washer is done.</FeedItem>
    <FeedItem name="Tan Saen" time="21:15">Heating is down to 18.</FeedItem>
    <FeedItem name="Pim Nok" time="19:02">Hall lamp set to warm.</FeedItem>
  </Feed>
);

export const FEED: Depth = {
  overview: (
    <>
      <p>Feed is a column of short posts, such as the activity log of a house: who did what and when. Each post shows the author in a recessed window, the name and time on one line and the text under them, with a seam between posts.</p>
      <p>It follows the WAI-ARIA feed pattern. The list is marked busy while more posts load, every post is an article that knows its place in the set, and Page Up and Page Down step from one post to the next. When the reader reaches the end, the Feed asks for more with a callback, or the reader presses the load more key.</p>
    </>
  ),
  whenToUse: ['To show a log or stream of posts that grows at the end, such as activity, messages or readings.', 'To let keyboard and screen reader users move post by post through a long run.'],
  whenNot: [
    { situation: 'A fixed list of rows the person chooses from', to: '/components/list', label: 'List' },
    { situation: 'Thousands of equal rows in a fixed window', to: '/components/virtual-list', label: 'VirtualList' },
    { situation: 'Events on a time line with a rail', to: '/components/timeline', label: 'Timeline' },
  ],
  variants: { na: 'Feed has one look, rows on the body with a seam between. What changes is its state: busy, has more, and new posts waiting.' },
  anatomy: {
    render: three(),
    parts: [
      { part: 'Avatar window', selector: '[role="feed"] > article > span:first-child', what: 'A 44px recess with the author’s picture or initials.' },
      { part: 'Name and time', selector: '[role="feed"] > article > div:nth-child(2)', what: 'The author’s name in medium weight and the time in secondary ink, on one line.' },
      { part: 'Text', selector: '[role="feed"] > article > div:nth-child(3)', what: 'The post’s text, under the name on the same inset line.' },
      { part: 'Footer', selector: '[data-component="Feed"] > div:last-child', what: 'The load more key, the loading mark or the end line, in a row of fixed height.' },
    ],
  },
  sizes: { na: 'Feed has one size. The avatar window is 44px and the posts take the width of their column.' },
  emphasis: { na: 'Feed has no primary control, so it holds no orange. The load more key and the notice key are plain keys.' },
  placement: {
    rows: [['Full height of a page or sheet', 'The Feed grows with the page and the page scrolls.'], ['A box with a set height', 'Give the box overflow and a height; the end watcher works inside it.']],
    examples: [{ title: 'In a unit', render: <Box>{three()}</Box> }],
  },
  combinations: {
    good: [['Feed + Banner', 'A Banner above the Feed carries a message about the whole stream.'], ['Feed + Tabs', 'Tabs choose the stream; each panel holds one Feed.']],
    avoid: [{ title: 'a Feed with one post', why: 'There is nothing to step between. Print the post as plain text.', render: <Box><Feed label="Activity"><FeedItem name="Mali Kaew" time="22:40">The washer is done.</FeedItem></Feed></Box> }],
  },
  content: {
    formula: <p>Put the author’s name in <em>name</em>, a short time in <em>time</em>, and the whole post in the children. Write the text so it makes sense when read alone, because a screen reader reads the name, then the time, then the text.</p>,
    pair: {
      do: <Box><Feed label="Activity"><FeedItem name="Mali Kaew" time="22:40">The washer is done.</FeedItem></Feed></Box>, doNote: 'Name, time and text each in their own part.',
      dont: <Box><Feed label="Activity"><FeedItem name="Mali Kaew">22:40 – Mali Kaew: The washer is done.</FeedItem></Feed></Box>, dontNote: 'The name and time are written again in the text.',
    },
    overflow: { text: 'A long name wraps beside the avatar and a long word in a post breaks, so no post grows wider than its column.', render: <Box><Feed label="Activity"><FeedItem name="Konstantin Alexandrovich Wolkenstein-Ortenburg" time="22:40">Averyveryveryverylongwordwithoutanybreaksinsideitatall in a post.</FeedItem></Feed></Box> },
    rtl: { text: 'In right-to-left languages the avatar window sits on the right and the text follows it.', render: <div dir="rtl"><Box><Feed label="النشاط"><FeedItem name="مريم" time="22:40">انتهت الغسالة.</FeedItem></Feed></Box></div> },
    expansion: { text: 'German text runs about 30% longer. It wraps under the name and the row grows; the avatar window stays 44px.', render: <Box><Feed label="Aktivität"><FeedItem name="Katharina" time="22:40">Die Waschmaschine ist fertig und die Wäsche liegt im Trockner.</FeedItem></Feed></Box> },
  },
  behaviours: {
    states: [
      ['Resting', 'Posts as rows with a seam between.', 'A feed of articles, each with its position.'],
      ['Focused post', 'A ring outline around the post.', 'Read as the name and time, then the text, with the position in the set.'],
      ['Busy', 'A loading mark in the footer in place of the key.', 'The feed is aria-busy and the loading words are read out.'],
      ['Has more', 'The load more key under the last post.', 'A button named Load more.'],
      ['New posts', 'A notice key hangs from the top edge.', 'The count is announced politely.'],
      ['End', 'A printed end line.', 'Read as text after the feed.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves from post to post, then to the load more key.', 'native'],
      ['Keyboard', 'Page Down', 'Moves focus to the next post. On the last post it asks for more when there is more.', 'Feed onKeyDown'],
      ['Keyboard', 'Page Up', 'Moves focus to the previous post.', 'Feed onKeyDown'],
      ['Scroll', 'Reach the end', 'Calls onNearEnd once while there is more and the feed is not busy.', 'IntersectionObserver'],
      ['Pointer', 'Press', 'The load more key and the notice key are 44px keys.', 'Button'],
    ],
    loading: <p>Set <code>busy</code> while a page loads. The feed is marked aria-busy, a loading mark replaces the key, and <code>onNearEnd</code> does not fire again until it ends.</p>,
    focus: <p>Focus rests on the post the person is reading. New posts never take focus, and the notice does not move any post. After loading more, focus stays where it was.</p>,
  },
  deepDive: { na: 'Feed has a single look, so there is no section per variant.' },
  modifiers: [
    {
      name: 'busy',
      rules: <p>Set <code>busy</code> from the moment you ask for more until the posts are in the list. Keep <code>hasMore</code> true while busy so the footer keeps its size.</p>,
      pair: { do: <Box><Feed label="Activity" busy hasMore><FeedItem name="Mali Kaew" time="22:40">The washer is done.</FeedItem></Feed></Box>, doNote: 'Busy with more to come.', dont: <Box><Feed label="Activity" busy><FeedItem name="Mali Kaew" time="22:40">The washer is done.</FeedItem></Feed></Box>, dontNote: 'Busy but ending: the footer swaps to the end line a moment later.' },
    },
    {
      name: 'newCount',
      rules: <p>Set <code>newCount</code> when posts arrive above the ones in view, and add them to the list only in <code>onShowNew</code>, so the reader’s place never moves under them.</p>,
      pair: { do: <Box><Feed label="Activity" newCount={2}><FeedItem name="Mali Kaew" time="22:40">The washer is done.</FeedItem><FeedItem name="Tan Saen" time="21:15">Heating is down.</FeedItem></Feed></Box>, doNote: 'The notice waits; the posts stay put.', dont: <Box><Feed label="Activity"><FeedItem name="Pim Nok" time="22:41">New post pushed in at once.</FeedItem><FeedItem name="Mali Kaew" time="22:40">The washer is done.</FeedItem></Feed></Box>, dontNote: 'Posts inserted above the reader shift everything down.' },
    },
  ],
  related: [['/components/list', 'List', 'A fixed list of rows to choose from.'], ['/components/virtual-list', 'VirtualList', 'Thousands of equal rows in a window.'], ['/components/timeline', 'Timeline', 'Events along a rail.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Feed pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/feed/', why: 'The roles, the keys and the busy state the Feed follows.' },
    { title: 'WCAG 2.2 · 2.1.1 Keyboard', url: 'https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html', why: 'Why loading more has a key as well as a scroll trigger.' },
    { title: 'MDN · IntersectionObserver', url: 'https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver', why: 'How the end of the list is watched.' },
  ],
};
