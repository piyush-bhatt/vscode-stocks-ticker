<p align="center">
  <img src="https://raw.githubusercontent.com/piyush-bhatt/vscode-stocks-ticker/main/media/icon/icon_logo.png" alt="Stocks Ticker Logo" /></a>
</p>

> [Stocks Ticker](https://marketplace.visualstudio.com/items?itemName=piyush-bhatt.stocks-ticker) provides you a **feature rich** price ticker for your favourite stocks, built into Visual Studio Code. It helps you to **stay updated** with the prices at a glance via watchlist, **get notified** at set limits, **get price quote** for stocks from multiple exchanges, and more.

# Stocks Ticker

Stocks Ticker is a Visual Studio Code extension, primarily focused on providing a price ticker for stocks selected by the user in a watchlist, along with on-demand price quotes and ability to set alerts for specific price limits.

# Features

### Price Quote

1. Open [**Command Palette**](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette) on Visual Studio Code.
2. Enter `Stocks Ticker: Get Price Quote`.
3. Enter the stock symbol to get price quote for.

[**Here is an example**](#price-quote- 'Jump to Price Quote')

### Watchlist

Clicking on the extension icon opens the watchlist which allows the following operations,

- **Add Stock:** [**Add a stock**](#add-remove-item- 'Jump to Add or Remove Watchlist item') to the watchlist to stay updated with its prices.
- **Configure:** [**Configure**](#configure- 'Jump to Configure') whether you want to see the price difference from previous day closing price in _Amount_ or _Percentage_.
- **Refresh:** Refresh the watchlist.

### Watchlist Item

Each watchlist item shows the following details for a stock,

- Abbreviated Exchange
- Stock Symbol
- Price

In addition to the details, following options are available for each item in the watchlist,

- **Mark as Favourite:** [**Add**](#mark-unmark-favourite- 'Jump to Mark or Unmark Favourite') the item to status bar for constant visibility.
- **Unmark Favourite:** [**Remove**](#mark-unmark-favourite- 'Jump to Mark or Unmark Favourite') the item from status bar, if added.
- **Notification:** [**Add**](#add-notification- 'Jump to Add Notification'), [**edit**](#edit-notification- 'Jump to Edit Notification') or [**delete**](#delete-notification- 'Jump to Delete Notification') notifications.
- **Refresh:** Fetch the latest price quote for the stock symbol.
- **Remove from Watchlist:** [**Remove the item**](#add-remove-item- 'Jump to Add or Remove Watchlist item') from the watchlist.

### Notifications

- [**Add**](#add-notification- 'Jump to Add Notification') multiple notifications for a stock symbol in the watchlist for a specific price limit. Provides option to choose an alert sound as well.
- [**Edit**](#edit-notification- 'Jump to Edit Notification') an existing notification for a stock symbol in the watchlist to change the target price, limit or alert sound.
- [**Delete**](#delete-notification- 'Jump to Delete Notification') a notification for a stock symbol in the watchlist.

# Usage

### Price Quote [#](#price-quote- 'Price Quote')

<p align="center">
  <img src="https://raw.githubusercontent.com/piyush-bhatt/vscode-stocks-ticker/main/media/readme/Price_Quote.gif" alt="Price Quote" />
</p>

### Search a Stock Symbol in multiple supported Exchanges [#](#search-symbol- 'Search Symbol')

<p align="center">
  <img src="https://raw.githubusercontent.com/piyush-bhatt/vscode-stocks-ticker/main/media/readme/Search_Symbol.gif" alt="Search Symbol" />
</p>

### Add or Remove a _Watchlist_ item [#](#add-remove-item- 'Add or Remove Watchlist item')

<p align="center">
  <img src="https://raw.githubusercontent.com/piyush-bhatt/vscode-stocks-ticker/main/media/readme/Add_Remove_Stock.gif" alt="Add or Remove Watchlist item" />
</p>

### Configure [#](#configure- 'Configure')

<p align="center">
  <img src="https://raw.githubusercontent.com/piyush-bhatt/vscode-stocks-ticker/main/media/readme/Amount_Percentage_Change.gif" alt="Configure" />
</p>

### Mark or Unmark Favourite [#](#mark-unmark-favourite- 'Mark or Unmark Favourite')

<p align="center">
  <img src="https://raw.githubusercontent.com/piyush-bhatt/vscode-stocks-ticker/main/media/readme/Mark_Unmark_Favourite.gif" alt="Mark or Unmark Favourite" />
</p>

### Add Notification [#](#add-notification- 'Add Notification')

<p align="center">
  <img src="https://raw.githubusercontent.com/piyush-bhatt/vscode-stocks-ticker/main/media/readme/Add_Notification.gif" alt="Add Notification" />
</p>

### Edit Notification [#](#edit-notification- 'Edit Notification')

<p align="center">
  <img src="https://raw.githubusercontent.com/piyush-bhatt/vscode-stocks-ticker/main/media/readme/Edit_Notification.gif" alt="Edit Notification" />
</p>

### Delete Notification [#](#delete-notification- 'Delete Notification')

<p align="center">
  <img src="https://raw.githubusercontent.com/piyush-bhatt/vscode-stocks-ticker/main/media/readme/Delete_Notification.gif" alt="Delete Notification" />
</p>

# Supported Indices/Exchanges

Following markets/indices/exchanges are supported. [Check here](https://help.yahoo.com/kb/SLN2310.html) for data sources for each of them. 

| Country                  | Market or Index                        |
| :----------------------- | :------------------------------------- |
| United States of America | Nasdaq Stock Exchange (NASDAQ)         |
| United States of America | New York Stock Exchange (NYSE)         |
| India                    | National Stock Exchange of India (NSE) |
| India                    | Bombay Stock Exchange (BSE)            |
| Australia                | Australian Stock Exchange (ASX)        |
| Belgium                  | Euronext Brussels                      |
| Brazil                   | Sao Paolo Stock Exchange (BOVESPA)     |
| Canada                   | Canadian Securities Exchange (CNQ)     |
| Canada                   | NEO Exchange (NEO)                     |
| Canada                   | Toronto Stock Exchange (TSX)           |
| Canada                   | TSX Venture Exchange (TSXV)            |
| Denmark                  | Nasdaq OMX Copenhagen (OMXC)           |
| Finland                  | Nasdaq OMX Helsinki (OMXH)             |
| France                   | Euronext Paris                         |
| Germany                  | Frankfurt Stock Exchange (FSX)         |
| Germany                  | Hamburg Stock Exchange (XHAM)          |
| Germany                  | Deutsche Boerse XETRA (XETR)           |
| Germany                  | Munich Stock Exchange (Munich)         |
| Germany                  | Stuttgart Stock Exchange (XSTU)        |
| Germany                  | Dusseldorf Stock Exchange (XDUS)       |
| Hong Kong                | Hong Kong Stock Exchange (HKEX)        |
| Netherlands              | Euronext Amsterdam                     |
| Norway                   | Oslo Stock Exchange (OSE)              |
| Russia                   | Moscow Exchange (MOEX)                 |
| Spain                    | Madrid SE C.A.T.S. (BME)               |
| Sweden                   | Nasdaq OMX Stockholm (OMX)             |
| Turkey                   | Borsa İstanbul (BIST)                  |
| United Kingdom           | London Stock Exchange (LSE)            |
