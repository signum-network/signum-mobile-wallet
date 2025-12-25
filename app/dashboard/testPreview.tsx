/* @ts-nocheck */


import {ProtectedScreen} from "@/features/Dashboard/components/ProtectedScreen";
import {TransactionPreview} from "@/features/Dashboard/Deeplinking/Sign/sections/TransactionPreview";
import type {Transaction} from "@signumjs/core";

// @ts-ignore
const SinglePayment = {
    "type": 0,
    "subtype": 0,
    "timestamp": 358945802,
    "deadline": 1440,
    "senderPublicKey": "45bafd320ca89d8fa716202620db414fee1e1a2503f6f995d6f2f126b144637c",
    "recipient": "15878172590474925784",
    "recipientRS": "S-N7QS-V36T-UB4L-FTNQS",
    "amountNQT": "100000000",
    "feeNQT": "1000000",
    "signature": "de013bf37ce30ab2f2b4457a7d1056b3f94dbca057128836b7ebef7b2c03fe074c349a092f12c1b373e6cf68f41cef30b693f0beb7d6134ecf614dd6b9e97395",
    "signatureHash": "e92941fcf5623da91a44d08db8f0c56c3f93ea81955b4d2d75c76b4c58784864",
    "fullHash": "0dfc0a1f887f8d1800857c41eaa9400aab25c25f88db16c7e8a2ab671a822f96",
    "transaction": "1769210451239566349",
    "attachment": {
        "version.Message": 1,
        "message": "0.32",
        "messageIsText": true
    },
    "attachmentBytes": "0104000080302e3332",
    "sender": "7692793722974812285",
    "senderRS": "S-BG5X-6A46-NKQN-8DLJP",
    "height": 1488918,
    "version": 2,
    "ecBlockId": "9830475282879550177",
    "ecBlockHeight": 1488907,
    "cashBackId": "7692793722974812285",
    "block": "12461984490200011444",
    "confirmations": 67,
    "blockTimestamp": 358945840,
    "requestProcessingTime": 3
}

// @ts-ignore
const MultiOut: Transaction = {
    "type": 0,
    "subtype": 1,
    "timestamp": 358940246,
    "deadline": 1440,
    "senderPublicKey": "3cd5610384aed89ace1550e54604b382394520089c14db4747fd1e8f188c5658",
    "amountNQT": "38578496116",
    "feeNQT": "2000000",
    "signature": "b2f0e2eb936a3b49b64806cd2de1e5398c60f9d73c61b4883acbc8ade11091096c8a7f9bcabeb1ac1e19efa89bb109a9176c8bc2f0e995b66b84e7647160a86a",
    "signatureHash": "5f2aa6dc9cbd0a07dbc6dc3e7bf7981d69cb3283e2cb42c1a5fc1e63440bd998",
    "fullHash": "00fcac94b2f5c884f8b7c002f3a42a862174970b8171b1a135aac0c3df7f523a",
    "transaction": "9568167555695967232",
    "attachment": {
        "version.MultiOutCreation": 1,
        "recipients": [
            [
                "4308531546476196184",
                "35554169999"
            ],
            [
                "3033777005113980426",
                "3024326117"
            ]
        ]
    },
    "sender": "15587859947385731145",
    "senderRS": "S-GG4B-34Y9-ZXGV-FNTNJ",
    "height": 1488894,
    "version": 2,
    "ecBlockId": "15116517126801931302",
    "ecBlockHeight": 1488883,
    "cashBackId": "14532404230105986816",
    "block": "17007192388508662552",
    "confirmations": 1,
    "blockTimestamp": 358940442,
    "requestProcessingTime": 1
}

// @ts-ignore
const BuyOrder = {
    "type": 2,
    "subtype": 3,
    "timestamp": 358943569,
    "deadline": 20,
    "senderPublicKey": "1d7b5f5dda8ed7e6d80482ddbec47f131f0ab327a432d455592baf56830c6d6e",
    "amountNQT": "0",
    "feeNQT": "1000000",
    "signature": "85913b7be8c261c2eb1c857c8c0ad3d2d87ccffd47c5c1fcb4ff02db6b46fb02414cc97fa2fe1c1df320437829ddc90971529636ac06cae4b020aedd032d7e00",
    "signatureHash": "8d075559a51c380d9d333a2e98a682825c4fbc0d5ffa9ff87ea7b8f70754d76f",
    "fullHash": "de2cbb9dedce8e40fd1955c81b21c4e643d6515680211971c65dba4ca7b2075f",
    "transaction": "4651882985069161694",
    "attachment": {
        "version.BidOrderPlacement": 1,
        "asset": "8155738025620305674",
        "quantityQNT": "5000000",
        "priceNQT": "4000"
    },
    "attachmentBytes": "010a773efa85002f71404b4c0000000000a00f000000000000",
    "sender": "8745189287196529307",
    "senderRS": "S-F6NV-CCGG-ER7W-99BRL",
    "height": 1488909,
    "version": 2,
    "ecBlockId": "9232189799057562070",
    "ecBlockHeight": 1488896,
    "cashBackId": "13420738867631717395",
    "block": "12297241646197802972",
    "confirmations": 16,
    "blockTimestamp": 358943727,
    "requestProcessingTime": 3
}

// @ts-ignore
const RemoveCommitment = {
    "type": 20,
    "subtype": 2,
    "timestamp": 358943306,
    "deadline": 1440,
    "senderPublicKey": "1d7b5f5dda8ed7e6d80482ddbec47f131f0ab327a432d455592baf56830c6d6e",
    "amountNQT": "0",
    "feeNQT": "1000000",
    "signature": "c509747d5da1cf820acb40d784ff86da16198d0effa826fb746d1debcf20490f52d00b466db212bd8e47634707cb98e2d008b3e7ef6d2aeefab52f29018ec3f5",
    "signatureHash": "aa68ffebc5f9b5093544d63d627a996d7c6731e47bdfc5681464961ba4099b04",
    "fullHash": "72e5c76abb9a9b0cfeb45dd6dac2e015d8b75f08b509b55f1914c40fa6cbb4ee",
    "transaction": "908489879586334066",
    "attachment": {
        "version.CommitmentRemove": 1,
        "amountNQT": 40000000000
    },
    "attachmentBytes": "0100902f5009000000",
    "sender": "8745189287196529307",
    "senderRS": "S-F6NV-CCGG-ER7W-99BRL",
    "height": 1488908,
    "version": 2,
    "ecBlockId": "16353643442864534642",
    "ecBlockHeight": 1488895,
    "cashBackId": "13420738867631717395",
    "block": "4969944150518445933",
    "confirmations": 32,
    "blockTimestamp": 358943476,
    "requestProcessingTime": 2
}

// @ts-ignore
const TokenMint = {
    "type": 2,
    "subtype": 6,
    "timestamp": 358942931,
    "deadline": 1440,
    "senderPublicKey": "3eba832d8f2c82fe000000000000000000000000000000000000000000000000",
    "amountNQT": "0",
    "feeNQT": "0",
    "transaction": "3773589494784925124",
    "attachment": {
        "version.AssetMint": 1,
        "asset": "11955007191311588286",
        "quantityQNT": "100"
    },
    "sender": "18339269626061634110",
    "senderRS": "S-9GKY-KWQS-HTZG-HEK2X",
    "height": 1488906,
    "version": 1,
    "ecBlockId": "0",
    "ecBlockHeight": 0,
    "cashBackId": "0",
    "block": "15018663663518929986",
    "confirmations": 37,
    "blockTimestamp": 358942931,
    "requestProcessingTime": 5
}

// @ts-ignore
const TokenTransfer = {
    "type": 2,
    "subtype": 1,
    "timestamp": 358942931,
    "deadline": 1440,
    "senderPublicKey": "3eba832d8f2c82fe000000000000000000000000000000000000000000000000",
    "recipient": "7692793722974812285",
    "recipientRS": "S-BG5X-6A46-NKQN-8DLJP",
    "amountNQT": "1000000000",
    "feeNQT": "10000000",
    "transaction": "2789749244902351233",
    "attachment": {
        "version.AssetTransfer": 1,
        "asset": "11955007191311588286",
        "quantityQNT": "100"
    },
    "attachmentBytes": "01be1b5e3db3b7e8a56400000000000000",
    "sender": "18339269626061634110",
    "senderRS": "S-9GKY-KWQS-HTZG-HEK2X",
    "height": 1488906,
    "version": 1,
    "ecBlockId": "0",
    "ecBlockHeight": 0,
    "cashBackId": "0",
    "block": "15018663663518929986",
    "confirmations": 50,
    "blockTimestamp": 358942931,
    "requestProcessingTime": 2
}

// @ts-ignore
const NftCreation = {
    "type": 22,
    "subtype": 0,
    "timestamp": 243882076,
    "deadline": 1440,
    "senderPublicKey": "7158e2e1170f9a3e1799ba4069ab55fac3d2242db5c0a08faf91c8b7cac3cb1f",
    "amountNQT": "0",
    "feeNQT": "40000000",
    "referencedTransactionFullHash": "4c840330c4352c62871d34cfbd0242f68f551fdbb9c12e013a1489a26009e16d",
    "signature": "e62be91a0a3b92a5400330bfc7742753f3bcd69115345a185f2d3107bdcb3f076ebb08745dc5d3acde1daed48e843dd082e4ee39f084d74871dfd57a3018e13a",
    "signatureHash": "fd360efcb10db26178c81da28fbbdca7a1e292615c17b570b547b3e8d93211d9",
    "fullHash": "d5d3ad66f7647d33c554db8370e7cc95556d9b27f9edfd68cacbf3720a055b40",
    "transaction": "3710232681765524437",
    "attachment": {
        "version.AutomatedTransactionsCreation": 1,
        "name": "NFTSRC40",
        "description": "{\"version\":1,\"descriptor\":\"QmVSvaFfrAwFbybZARRwan4mevqqXv3JJecYNCYsW4kRTn\"}",
        "creationBytes": "02000000000002000100010080c3c9010000000000d800969340ad774bc377010000000000000000ca9a3b000000005714bbc7aeeee27b14000000000000000a00000000000000969340ad774bc3777f5158d895cdf9cf635ddd6dc5fb45b2db00a2261f9625285d6e31f2c7a6fa4ab998f22771ac710ae5c2ab19bf16f313b0b755338a886ccec81c2396fdf26bc66f17199814c7e73775f214a39fc924119e711383d1b25ccb000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
    },
    "attachmentBytes": "01084e465453524334304b007b2276657273696f6e223a312c2264657363726970746f72223a22516d565376614666724177466279625a41525277616e346d657671715876334a4a6563594e43597357346b52546e227d02000000000002000100010080c3c9010000000000d800969340ad774bc377010000000000000000ca9a3b000000005714bbc7aeeee27b14000000000000000a00000000000000969340ad774bc3777f5158d895cdf9cf635ddd6dc5fb45b2db00a2261f9625285d6e31f2c7a6fa4ab998f22771ac710ae5c2ab19bf16f313b0b755338a886ccec81c2396fdf26bc66f17199814c7e73775f214a39fc924119e711383d1b25ccb000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "sender": "8629824288351884182",
    "senderRS": "S-36WQ-GYQN-D856-9DUJH",
    "height": 1010129,
    "version": 1,
    "ecBlockId": "5977152265174473739",
    "ecBlockHeight": 1010119,
    "cashBackId": "0",
    "block": "8986957310882095842",
    "confirmations": 478867,
    "blockTimestamp": 243882223,
    "requestProcessingTime": 32
}

const NftInteraction = {
    "type": 0,
    "subtype": 0,
    "timestamp": 301770207,
    "deadline": 1440,
    "senderPublicKey": "26b401ce84497e1a9ecc114ca981a285673844f96849980b7784b17b0f93c30b",
    "recipient": "9482276719950823724",
    "recipientRS": "S-22BE-G23C-L7C7-AJY79",
    "amountNQT": "30000000",
    "feeNQT": "2000000",
    "signature": "74291fd7df90d7212ac67d694fd7869ef0338501ea083cf4fa1e26e633217705a72d4d70969be7352031010d16c2e69906632e81e6788d2c8c3359c8d1d660a9",
    "signatureHash": "77317adf0b4f07f715ff178e856b6127bb3bf7f1467e5ad9808d2e899414dc41",
    "fullHash": "b3af4193ce37207dadbc030bd547b33a06f0ea244d2f6978037427deee98fc2d",
    "transaction": "9016267814369079219",
    "attachment": {
        "version.Message": 1,
        "message": "c8aea1c25fe7bffe",
        "messageIsText": false
    },
    "attachmentBytes": "0108000000c8aea1c25fe7bffe",
    "sender": "2351301786909483180",
    "senderRS": "S-QA7E-JKW9-Y4XG-42EA3",
    "height": 1251167,
    "version": 2,
    "ecBlockId": "9569331467873209623",
    "ecBlockHeight": 1251155,
    "cashBackId": "13420738867631717395",
    "block": "1867158661893240637",
    "confirmations": 237869,
    "blockTimestamp": 301770460,
    "requestProcessingTime": 1
}


export default function Screen() {
    return (
        <ProtectedScreen>
            {/* @ts-ignore*/}
            <TransactionPreview transaction={NftInteraction} />
        </ProtectedScreen>
    );
}
