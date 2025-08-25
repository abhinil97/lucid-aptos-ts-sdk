# Lucid Aptos Protocol TypeScript SDK

A comprehensive TypeScript SDK for interacting with the Lucid Aptos Protocol, built with modern development practices and full type safety.

## 🚀 Features

- **Full TypeScript Support** - Complete type definitions and IntelliSense
- **Builder Pattern** - Fluent API for constructing transactions and accounts
- **Utility Functions** - Address validation, hex conversion, and more
- **Comprehensive Testing** - Unit and integration tests with Jest
- **Modern Build System** - Vite-based bundling with multiple output formats
- **Code Quality** - ESLint and Prettier for consistent code style
- **Documentation** - Auto-generated API docs with TypeDoc

## 📦 Installation

```bash
npm install lucid-aptos-ts-sdk
# or
yarn add lucid-aptos-ts-sdk
# or
pnpm add lucid-aptos-ts-sdk
```

## 🔧 Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd lucid-aptos-ts-sdk
```

2. Install dependencies:
```bash
pnpm install
```

3. Available scripts:
```bash
# Build the SDK
pnpm build

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Lint code
pnpm lint

# Format code
pnpm format

# Generate documentation
pnpm docs

# Type checking
pnpm type-check
```

## 📖 Usage Examples

### Basic Address Validation

```typescript
import { isValidAptosAddress, formatAddress } from 'lucid-aptos-ts-sdk';

const address = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

if (isValidAptosAddress(address)) {
  console.log(`Formatted address: ${formatAddress(address)}`);
  // Output: Formatted address: 0x1234...cdef
}
```

### Building Transactions

```typescript
import { TransactionBuilder } from 'lucid-aptos-ts-sdk';

const transaction = new TransactionBuilder()
  .setSender('0x...')
  .setPayload({ function: 'transfer', args: ['0x...', 100] })
  .setGasLimit(3000)
  .setMaxGasAmount(3000)
  .setGasUnitPrice(150)
  .build();

console.log(transaction);
```

### Building Accounts

```typescript
import { AccountBuilder } from 'lucid-aptos-ts-sdk';

const account = new AccountBuilder()
  .setAddress('0x...')
  .setSequenceNumber('42')
  .setAuthenticationKey('0x...')
  .build();

console.log(account);
```

## 🏗️ Project Structure

```
lucid-aptos-ts-sdk/
├── src/                    # Source code
│   ├── clients/           # Client implementations
│   ├── types/             # Type definitions
│   ├── utils/             # Utility functions
│   ├── builders/          # Builder classes
│   └── index.ts           # Main entry point
├── examples/              # Usage examples
├── tests/                 # Test files
│   ├── unit/             # Unit tests
│   └── integration/      # Integration tests
├── docs/                  # Generated documentation
└── dist/                  # Build output
```

## 🧪 Testing

The SDK includes comprehensive testing:

- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test SDK workflows end-to-end
- **Coverage**: Aim for 80%+ code coverage

Run tests with:
```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage report
```

## 📚 API Documentation

Generate API documentation:
```bash
pnpm docs
```

Documentation will be available in the `docs/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🔗 Dependencies

- **@aptos-labs/ts-sdk**: Core Aptos functionality
- **TypeScript**: Type safety and modern JavaScript features
- **Vite**: Fast build tool and development server
- **Jest**: Testing framework
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeDoc**: API documentation generation

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Check the documentation
- Review the examples

---

Built with ❤️ for the Aptos ecosystem 