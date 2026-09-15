# Currency Converter

A professional and responsive Currency Converter built using HTML, CSS, and JavaScript. The application uses a public exchange-rate API to convert amounts between multiple currencies and provides conversion history, currency swapping, quick amounts, and theme support.

## Features

- Convert between 14 currencies
- Swap From and To currencies
- Automatic currency symbols
- Display exchange rate
- Display exchange-rate date
- Quick conversion buttons
- Recent conversion history
- Click history items to reuse a conversion
- Clear conversion history with confirmation
- Local Storage support
- Dark/Light mode
- Toast notifications
- Loading state while fetching rates
- API error handling
- Input validation
- Responsive design
- Personal signature watermark
- Professional blue/slate UI

## Supported Currencies

| Code | Currency |
|------|----------|
| USD | US Dollar |
| INR | Indian Rupee |
| EUR | Euro |
| GBP | British Pound |
| JPY | Japanese Yen |
| AUD | Australian Dollar |
| CAD | Canadian Dollar |
| CHF | Swiss Franc |
| CNY | Chinese Yuan |
| SGD | Singapore Dollar |
| AED | UAE Dirham |
| SAR | Saudi Riyal |
| NZD | New Zealand Dollar |
| ZAR | South African Rand |

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Fetch API
- Frankfurter API
- Local Storage
- SVG

## API

This project uses the Frankfurter API to obtain exchange-rate data.

Website:

https://frankfurter.dev/

The application uses the following API endpoint:

```text
https://api.frankfurter.dev/v2/rate/{base}/{quote}