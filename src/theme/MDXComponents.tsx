/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import MDXComponents from '@theme-original/MDXComponents';
import Code from '@theme/MDXComponents/Code';
import Highlight from '@site/src/components/Highlight';
import TweetQuote from '@site/src/components/TweetQuote';
import BrowserWindow from '@site/src/components/BrowserWindow';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Zoom from 'react-medium-image-zoom';
// import useBaseUrl from '@docusaurus/useBaseUrl';

export default {
  ...MDXComponents,
  Code,
  Highlight,
  TweetQuote,
  BrowserWindow,
  Tabs,
  TabItem,
  Zoom,
};
