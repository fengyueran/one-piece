# 🧭 Compass UI

> A React component library that guides your way to better user experience

Compass UI is a comprehensive React component library inspired by Ant Design, designed to help developers navigate through complex UI challenges with ease and precision.

## ✨ Features

- 🎯 **Navigation-First Design** - Components designed with user journey in mind
- 🧭 **Consistent Direction** - Unified design language across all components
- ⚡ **Performance Optimized** - Lightweight and fast components
- 🎨 **Highly Customizable** - Flexible theming and styling options
- 📱 **Responsive Ready** - Mobile-first approach
- 🔧 **TypeScript Support** - Full type safety out of the box
- 🌍 **Accessibility** - WCAG 2.1 compliant components

## 📦 Installation

```bash
npm install @xinghunm/compass-ui
# or
yarn add @xinghunm/compass-ui
# or
pnpm add @xinghunm/compass-ui
```

## 🚀 Quick Start

```tsx
import React from 'react'
import { Button, ThemeProvider, defaultTheme } from '@xinghunm/compass-ui'

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Button variant="primary">Navigate Forward</Button>
    </ThemeProvider>
  )
}

export default App
```

## 🧭 Design Philosophy

### Navigation-Centric

Every component is designed to guide users naturally through their journey, like a compass pointing the way.

### Consistent & Reliable

Just as a compass always points north, our components provide consistent behavior and appearance across your application.

### Intuitive Direction

Clear visual hierarchy and interaction patterns that feel natural and predictable.

## 📚 Components

### Navigation

- [x] Menu
- [x] Dropdown
- [x] Pagination
- [x] Steps
- [ ] Breadcrumb
- [ ] Navigation Bar

### Layout

- [ ] Container
- [ ] Grid
- [ ] Space
- [ ] Divider

### General

- [x] Button
- [x] ConfigProvider
- [ ] Icon
- [ ] Typography

### Data Entry

- [x] Input
- [x] Textarea
- [x] InputNumber
- [x] Select
- [x] DatePicker
- [x] Form
- [x] Checkbox
- [x] Radio
- [x] Switch

### Data Display

- [x] Tree
- [x] Table
- [ ] List
- [ ] Card
- [ ] Avatar
- [ ] Badge
- [ ] Tag
- [x] Tooltip

### Feedback

- [x] Message
- [x] Modal
- [x] Progress
- [x] Alert
- [x] Empty
- [ ] Drawer
- [x] Skeleton
- [x] SpinLoading

### Theming

- [x] ThemeProvider
- [x] defaultTheme

## 📖 Documentation

- [API Documentation](./docs/API.md) - Complete API reference
- [Development Guide](./docs/DEVELOPMENT.md) - Development workflow and standards
- [Changelog](./CHANGELOG.md) - Version history

## 📄 License

MIT © [xinghunm](https://github.com/fengyueran)

_"A good compass will guide you home, good components will guide users to success."_
