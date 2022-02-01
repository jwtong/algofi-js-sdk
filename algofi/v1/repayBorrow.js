"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.prepareRepayBorrowTransactions = void 0;
var algosdk_1 = require("algosdk");
var utils_1 = require("../utils");
var contractStrings_1 = require("../contractStrings");
var prepend_1 = require("./prepend");
var enc = new TextEncoder();
/**
 * Returns a transaction group object representing a repay borrow
 * group transaction against the algofi protocol. The sender repays assets to the
 * market of the borrow asset after which the market application decreases the
 * outstanding borrow amount for the sender.
 *
 * @param sender - account address for sender
 * @param suggestedParams - suggested transaction params
 * @param storageAccount - storage account address for sender
 * @param amount - amoutn of borrow asset to repay
 * @param managerAppId - id of the manager application
 * @param marketAppId - id of the market application of the borrow asset
 * @param marketAddress - account address for the market application
 * @param supportedMarketAppIds - list of supported market application ids
 * @param supportedOracleAppIds - list of supported oracle application ids
 * @param assetId - asset id of the borrow asset, defaults to algo
 * @returns transaction group object representing a repay borrow group transaction
 */
function prepareRepayBorrowTransactions(sender, suggestedParams, storageAccount, amount, managerAppId, marketAppId, marketAddress, supportedMarketAppIds, supportedOracleAppIds, assetId) {
    if (assetId === void 0) { assetId = null; }
    var prefixTransactions = (0, prepend_1.getInitTxns)(utils_1.Transactions.REPAY_BORROW, sender, suggestedParams, managerAppId, supportedMarketAppIds, supportedOracleAppIds, storageAccount);
    var txn0 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, managerAppId, [enc.encode(contractStrings_1.managerStrings.repay_borrow)]);
    var txn1 = (0, algosdk_1.makeApplicationNoOpTxn)(sender, suggestedParams, marketAppId, [enc.encode(contractStrings_1.managerStrings.repay_borrow)], [storageAccount], [managerAppId], assetId ? [assetId] : []);
    var txn2;
    if (assetId) {
        txn2 = (0, algosdk_1.makeAssetTransferTxnWithSuggestedParams)(sender, marketAddress, undefined, undefined, amount, undefined, assetId, suggestedParams);
    }
    else {
        txn2 = (0, algosdk_1.makePaymentTxnWithSuggestedParams)(sender, marketAddress, amount, undefined, undefined, suggestedParams);
    }
    return new utils_1.TransactionGroup(__spreadArray(__spreadArray([], prefixTransactions, true), [txn0, txn1, txn2], false));
}
exports.prepareRepayBorrowTransactions = prepareRepayBorrowTransactions;
