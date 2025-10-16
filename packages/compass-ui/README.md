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

- [ ] Navigation Bar
- [ ] Breadcrumb
- [ ] Menu
- [ ] Pagination
- [ ] Steps

### Layout

- [ ] Container
- [ ] Grid
- [ ] Space
- [ ] Divider

### General

- [x] Button
- [ ] Icon
- [ ] Typography

### Data Entry

- [ ] Input
- [ ] Select
- [ ] DatePicker
- [ ] Form

### Data Display

- [ ] Table
- [ ] List
- [ ] Card
- [ ] Avatar

### Feedback

- [ ] Alert
- [ ] Message
- [ ] Modal
- [ ] Drawer

### Theming

- [x] ThemeProvider
- [x] defaultTheme

## 🎨 Theming

Compass UI supports comprehensive theming to match your brand:

```tsx
import { ThemeProvider } from '@one-piece/compass-ui'

const theme = {
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',
}

function App() {
  return <ThemeProvider theme={theme}>{/* Your app */}</ThemeProvider>
}
```

## 📖 Documentation

- [API Documentation](./docs/API.md) - Complete API reference
- [Development Guide](./docs/DEVELOPMENT.md) - Development workflow and standards
- [Contributing Guide](./docs/CONTRIBUTING.md) - How to contribute
- [Changelog](./CHANGELOG.md) - Version history

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/CONTRIBUTING.md) for details on:

- Reporting bugs
- Suggesting features
- Submitting pull requests
- Development workflow

## 📄 License

MIT © [xinghunm](https://github.com/fengyueran)

---

_"A good compass will guide you home, good components will guide users to success."_
