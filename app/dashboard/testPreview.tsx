/* @ts-nocheck */


import {ProtectedScreen} from "@/features/Dashboard/components/ProtectedScreen";
import {TransactionPreviewSection} from "@/features/Dashboard/Deeplinking/Sign/sections/TransactionPreviewSection";
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
const TokenIssuance = {
    "type": 2,
    "subtype": 0,
    "timestamp": 358628410,
    "deadline": 120,
    "senderPublicKey": "0cbe58e77ae222840c7da3641b3091a462062f0954cce8c833527285ca4ba005",
    "amountNQT": "0",
    "feeNQT": "15000000000",
    "signature": "6be927ef5f26c7f21f068cc6be16801fd64abfb7f0ab88dd78b5d883a692f70bf2eaa084db24cb856073da20ca2caaf69189abf3d548592507f9446117f139f7",
    "signatureHash": "dcb5663834242e9992f5caaea06249c1d53cde8ab21426d78e3faae467e1c6e9",
    "fullHash": "518d6ac926badc6d6a19dbfe82b42b1a58ede5fbef42b267fc2a076234e0f549",
    "transaction": "7916406920761216337",
    "attachment": {
        "version.AssetIssuance": 2,
        "name": "CTMAGNET",
        "description": "{\"vs\":1,\"nm\":\"CTMAGNET\",\"id\":\"\",\"ds\":\"Polarized from cosmic fields, attractive and repulsive in perfect balance. CTMAGNET tokens pull victory toward you while pushing defeat away. Each pole strengthens your magnetic dominance, warping trajectories and fates. Control the invisible forces that bind reality—become the lodestone of war.\",\"av\":{\"bafkreicxckspupmtllqhn4nj64obspl26uemqsbrszti55opjlnrnanu3q\":\"image/jpeg\"}}",
        "decimals": 0,
        "mintable": true,
        "quantityQNT": "1000"
    },
    "attachmentBytes": "020843544d41474e4554a4017b227673223a312c226e6d223a2243544d41474e4554222c226964223a22222c226473223a22506f6c6172697a65642066726f6d20636f736d6963206669656c64732c206174747261637469766520616e6420726570756c7369766520696e20706572666563742062616c616e63652e2043544d41474e455420746f6b656e732070756c6c20766963746f727920746f7761726420796f75207768696c652070757368696e672064656665617420617761792e204561636820706f6c6520737472656e677468656e7320796f7572206d61676e6574696320646f6d696e616e63652c2077617270696e67207472616a6563746f7269657320616e642066617465732e20436f6e74726f6c2074686520696e76697369626c6520666f7263657320746861742062696e64207265616c697479e280946265636f6d6520746865206c6f646573746f6e65206f66207761722e222c226176223a7b226261666b7265696378636b737075706d746c6c71686e346e6a36346f6273706c323675656d71736272737a746935356f706a6c6e726e616e753371223a22696d6167652f6a706567227d7de8030000000000000001",
    "sender": "15494782160211780241",
    "senderRS": "S-RANK-AYKR-LJBJ-F864G",
    "height": 1487596,
    "version": 2,
    "ecBlockId": "2050528233562144107",
    "ecBlockHeight": 1487586,
    "cashBackId": "15346065480176948044",
    "block": "17379123848125830435",
    "confirmations": 1511,
    "blockTimestamp": 358628464,
    "requestProcessingTime": 5
}

// @ts-ignore
const TokenMint = {
    "type": 2,
    "subtype": 6,
    "timestamp": 358942931,
    "deadline": 1440,
    "senderPublicKey": "3eba832d8f2c82fe000000000000000000000000000000000000000000000000",
    "amountNQT": "0",
    "feeNQT": "20000000",
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

// @ts-ignore
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

// @ts-ignore
const AliasAssignment = {
    "type": 1,
    "subtype": 1,
    "timestamp": 358628990,
    "deadline": 1440,
    "senderPublicKey": "0cbe58e77ae222840c7da3641b3091a462062f0954cce8c833527285ca4ba005",
    "amountNQT": "0",
    "feeNQT": "60000000",
    "signature": "a05f8da80a71a78d3ad4b802a6c3938f58ea63cead4c89a19a07215e5dada901f60be177052f013e3dc998ef7e376db4b57f23b08931a16f7929e43f97f515b3",
    "signatureHash": "1dc94d93291a1bc02f971aef2013f51469fbf7554474991902ae15f186cb5ee2",
    "fullHash": "05c116ff5ec6e056d57ae9cdce82a8438d5148cd5fbc491718b3b125eb51df34",
    "transaction": "6260221593353896197",
    "attachment": {
        "version.AliasAssignment": 2,
        "alias": "signarank_token_water",
        "uri": "{\"vs\":1,\"nm\":\"CTWATER\",\"id\":\"9614362460388221276\",\"ds\":\"Fluid as ancient oceans, persistent as the tide. CTWATER tokens flow through combat with adaptive grace, eroding defenses with patient inevitability. Each droplet joins the deluge, amplifying your strikes into tsunamis of power. Drown your foes in overwhelming force—become the endless current.\",\"av\":{\"bafkreiepled6fwoethm7n4kae65srfrpaca4v35dtq3lw3neudckkvmg4a\":\"image/jpeg\"}}",
        "tld": "0"
    },
    "attachmentBytes": "02157369676e6172616e6b5f746f6b656e5f7761746572b4017b227673223a312c226e6d223a2243545741544552222c226964223a2239363134333632343630333838323231323736222c226473223a22466c75696420617320616e6369656e74206f6365616e732c2070657273697374656e742061732074686520746964652e204354574154455220746f6b656e7320666c6f77207468726f75676820636f6d62617420776974682061646170746976652067726163652c2065726f64696e6720646566656e73657320776974682070617469656e7420696e657669746162696c6974792e20456163682064726f706c6574206a6f696e73207468652064656c7567652c20616d706c696679696e6720796f757220737472696b657320696e746f207473756e616d6973206f6620706f7765722e2044726f776e20796f757220666f657320696e206f7665727768656c6d696e6720666f726365e280946265636f6d652074686520656e646c6573732063757272656e742e222c226176223a7b226261666b72656965706c65643666776f6574686d376e346b61653635737266727061636134763335647471336c77336e657564636b6b766d673461223a22696d6167652f6a706567227d7d0000000000000000",
    "sender": "15494782160211780241",
    "senderRS": "S-RANK-AYKR-LJBJ-F864G",
    "height": 1487599,
    "version": 2,
    "ecBlockId": "552274248194591120",
    "ecBlockHeight": 1487588,
    "cashBackId": "15346065480176948044",
    "block": "10677277385965285733",
    "confirmations": 1443,
    "blockTimestamp": 358629254,
    "requestProcessingTime": 2
}

// @ts-ignore
const AliasSell = {
    "type": 1,
    "subtype": 6,
    "timestamp": 350886871,
    "deadline": 1440,
    "senderPublicKey": "a776986f016b52c3701478902af5a6bdf0c917a656f726b9c69d917861434d2e",
    "recipient": "6815821449111209138",
    "recipientRS": "S-837L-HW5E-PF3Z-7BP7X",
    "amountNQT": "0",
    "feeNQT": "1000000",
    "signature": "b133acf4f2d8252e0e1e563cf6ebb79767c6b77da049256e6b744cffb7301a0cf01da405c5e2e951d9343a02c4ddd16843090a68c889aeb13e41b079e4281fe3",
    "signatureHash": "d1ba1b693f74bfaf08d579d9ce3adc54401311a34114f8089d5e14e4da98ae70",
    "fullHash": "7da60b28a5f9f4944e98ec558c659232606988d8aa729fda86943b88dd2c3ec9",
    "transaction": "10733478299667506813",
    "attachment": {
        "version.AliasSell": 2,
        "alias": "5649759538149357109",
        "priceNQT": "0"
    },
    "attachmentBytes": "023576c4c15dfa674e0000000000000000",
    "sender": "4575517562750960384",
    "senderRS": "S-C2S2-ZERP-XRPG-52WZY",
    "height": 1455361,
    "version": 2,
    "ecBlockId": "5277218634261349155",
    "ecBlockHeight": 1455349,
    "cashBackId": "6815821449111209138",
    "block": "8188888340404756158",
    "confirmations": 33688,
    "blockTimestamp": 350887057,
    "requestProcessingTime": 2
}

// @ts-ignore
const AliasBuy = {
    "type": 1,
    "subtype": 7,
    "timestamp": 310024786,
    "deadline": 1440,
    "senderPublicKey": "289e590d062fd2ca90f96655324c0cc24e5bcb5c6e129086aaa9010ea1ebf631",
    "recipient": "13657951110994294056",
    "recipientRS": "S-GXBA-7JP9-NR7S-DCQ4V",
    "amountNQT": "1000000",
    "feeNQT": "1000000",
    "signature": "e5dfdd7b26c9fd8f35185939a090e9ab04ae158284a2018525cb7334f8cf1400d7eb026b0f8ea72baa9b78b249b9b14294bdd988f54c528966407e83e4f43015",
    "signatureHash": "31fca73f9dc07ce527d2aebbfde0af780d21ecd81bc2b8e21e897595e69f812f",
    "fullHash": "ad4ca596edcb034ce7dea740773b1c8f926d4978dffd24eb564951df15aa68ce",
    "transaction": "5477445793107758253",
    "attachment": {
        "version.AliasBuy": 2,
        "alias": "5121993133738267681"
    },
    "attachmentBytes": "022194751e9ef91447",
    "sender": "2379674988958835449",
    "senderRS": "S-DSRT-TFGW-TJBF-4FL34",
    "height": 1285541,
    "version": 2,
    "ecBlockId": "1342421415808838193",
    "ecBlockHeight": 1285529,
    "cashBackId": "13420738867631717395",
    "block": "3519448829487069880",
    "confirmations": 203513,
    "blockTimestamp": 310024993,
    "requestProcessingTime": 48
}

// @ts-ignore
const AccountInfo = {
    "type": 1,
    "subtype": 5,
    "timestamp": 355767495,
    "deadline": 1440,
    "senderPublicKey": "21fd0dd366001b7a9b9051ccbed5d4e738804698c72c4215506cd32ebad4a23c",
    "amountNQT": "0",
    "feeNQT": "4000000",
    "signature": "65f0c2ae0ea09efa55167f86f0e27a5a13b48eb46a85f43a9d371c2a00f94e021c15490397d983e9622842123726c7260d7c1881b6d1c0c1ce8bb1558911a6e2",
    "signatureHash": "d75b037644a87427594b26cdc2c785006780b18fd09511bf25a60a85cca78cd1",
    "fullHash": "5507d1b51bdc4abd97d0f42d84354112b59f31f188bbe5b5b2ffa361473da9ad",
    "transaction": "13639956433017571157",
    "attachment": {
        "version.AccountInfo": 1,
        "name": "JustForFun",
        "description": "{\"nm\":\"JustForFun\",\"ds\":\"-\",\"si\":{\"QmNfwMZAfNmG4kdeyHtjwwpbgcSDvbwAGTpATYfR5trTzB\":\"image/webp\"},\"av\":{\"QmdjwhcLJHKBMUpt5RSgHJyhYnQBK1RabFRQN8TESKRqBh\":\"image/png\"},\"bg\":{\"QmdfQhmWoPeRPrWUcM6TirGbzMhQp69NqxWKPMTJb2tvZx\":\"image/webp\"},\"tw\":\"https://twitter.com/BubbaX12\",\"sc\":[],\"vs\":1,\"tp\":\"hum\"}"
    },
    "attachmentBytes": "010a4a757374466f7246756e28017b226e6d223a224a757374466f7246756e222c226473223a222d222c227369223a7b22516d4e66774d5a41664e6d47346b64657948746a7777706267635344766277414754704154596652357472547a42223a22696d6167652f77656270227d2c226176223a7b22516d646a7768634c4a484b424d55707435525367484a7968596e51424b315261624652514e385445534b52714268223a22696d6167652f706e67227d2c226267223a7b22516d646651686d576f50655250725755634d3654697247627a4d68517036394e7178574b504d544a623274765a78223a22696d6167652f77656270227d2c227477223a2268747470733a2f2f747769747465722e636f6d2f4275626261583132222c227363223a5b5d2c227673223a312c227470223a2268756d227d",
    "sender": "12321901348576797154",
    "senderRS": "S-9AH4-ZS5P-BCFS-CH32Q",
    "height": 1475681,
    "version": 2,
    "ecBlockId": "6627171883849180304",
    "ecBlockHeight": 1475670,
    "cashBackId": "13420738867631717395",
    "block": "17210829931958635200",
    "confirmations": 13380,
    "blockTimestamp": 355767679,
    "requestProcessingTime": 6
}

// @ts-ignore
const TldAssign = {
    "type": 1,
    "subtype": 8,
    "timestamp": 277474450,
    "deadline": 20,
    "senderPublicKey": "41074bdc6430fc0eafffab07682c092922c39475ddfaaf09451dc9950c1bc45f",
    "amountNQT": "10000000000000",
    "feeNQT": "1000000",
    "signature": "1cd3e70c9a2e0633efd38453f23a405acd4e3d00b93fc39b54054c39733ab0045543b0b10617d4b3e9deff63f765e13a5a246ccf814c5df3b418ef6fd080e43c",
    "signatureHash": "81f3dfb88acaef5928d7c1abb949088f0b635c9bbb43aedb581752f1f07c1c64",
    "fullHash": "598e18a1bc431ea614e5dd0e96c20f863c10bb4adc8903cc20bcd9ff8e90a25c",
    "transaction": "11970079337033010777",
    "attachment": {
        "version.TLDAssignment": 1,
        "tld": "nostr"
    },
    "attachmentBytes": "01056e6f737472",
    "sender": "8952122635653861124",
    "senderRS": "S-5MS6-5FBY-74H4-9N4HS",
    "height": 1150002,
    "version": 2,
    "ecBlockId": "11982308580065253952",
    "ecBlockHeight": 1149991,
    "cashBackId": "8952122635653861124",
    "block": "16760537394786822433",
    "confirmations": 339073,
    "blockTimestamp": 277474602,
    "requestProcessingTime": 9
}

// @ts-ignore
const Distribution = {
    "type": 2,
    "subtype": 8,
    "timestamp": 358967314,
    "deadline": 1440,
    "senderPublicKey": "010c0fe9f4f0da47000000000000000000000000000000000000000000000000",
    "amountNQT": "1400000000",
    "feeNQT": "0",
    "transaction": "18272204999090662765",
    "attachment": {
        "version.AssetDistributeToHolders": 1,
        "asset": "9381200141252723234",
        "quantityMinimumQNT": 1,
        "assetToDistribute": "9518219425200752102",
        "quantityQNT": "10000"
    },
    "attachmentBytes": "0122823622d3b730820100000000000000e6455035238217841027000000000000",
    "sender": "5177715656288570369",
    "senderRS": "S-Y523-YMNJ-NZBR-6JRQH",
    "height": 1489007,
    "version": 1,
    "ecBlockId": "0",
    "ecBlockHeight": 0,
    "cashBackId": "0",
    "block": "12097271883525001420",
    "confirmations": 76,
    "blockTimestamp": 358967314,
    "requestProcessingTime": 3
}

// @ts-ignore
const AddTreasury = {
    "type": 2,
    "subtype": 7,
    "timestamp": 351103346,
    "deadline": 1440,
    "senderPublicKey": "cb331f06d243b0fd579b5969e20870266051dc7e9618109947058d614ab90f4f",
    "recipient": "6815821449111209138",
    "recipientRS": "S-837L-HW5E-PF3Z-7BP7X",
    "amountNQT": "0",
    "feeNQT": "1000000",
    "referencedTransactionFullHash": "b3a32abbfe061619fdbd3a0614166b5790ccbd486cbe1f07d74eeac86ee32ff0",
    "signature": "1836087420979d6b65012eb3a74f7d084e8e223531856ab9f5411d44e8203d0f4b95273de6e1c3bdaff2eb0e79f146b68ecef8c327fbb3a5d57aba7d77a56e5c",
    "signatureHash": "46ca9c10d413cf2685f6edfb32568837e673b82ce1b8811ab8516c61c4546bb1",
    "fullHash": "9292347567ec6f1bb7fc689f3163a88cfff8357b6adac9cc56680a216cc2ec21",
    "transaction": "1977058690531103378",
    "sender": "6815821449111209138",
    "senderRS": "S-837L-HW5E-PF3Z-7BP7X",
    "height": 1456261,
    "version": 2,
    "ecBlockId": "16932561710995130365",
    "ecBlockHeight": 1456250,
    "cashBackId": "13420738867631717395",
    "block": "3249516572680036243",
    "confirmations": 32853,
    "blockTimestamp": 351103355,
    "requestProcessingTime": 1
}

// @ts-ignore
const TransferOwnerhsip = {
    "type": 2,
    "subtype": 10,
    "timestamp": 350886833,
    "deadline": 1440,
    "senderPublicKey": "a776986f016b52c3701478902af5a6bdf0c917a656f726b9c69d917861434d2e",
    "recipient": "6815821449111209138",
    "recipientRS": "S-837L-HW5E-PF3Z-7BP7X",
    "amountNQT": "0",
    "feeNQT": "15000000000",
    "referencedTransactionFullHash": "e980faee75ec6fdaf8aab5daa8881672497a66b34ab8e53fb3f3bfc0f1d8dc4a",
    "signature": "0e19558f98ed95f22ba77769099a33b43e962663f43cf46c669294f9deefaa0dd6116905c01d2f3d8ec8153088fd7268958372d7f5fb2cad3da5186d8e86e884",
    "signatureHash": "d8762b8d57e111b5951ab10540f7c7849c59c21672592f5c6468c7f57444ce55",
    "fullHash": "8f0a9ad2ffd37f14cd46d94ce728fe2691d4485456b33e5f91da2a53ba7efa05",
    "transaction": "1477132298504243855",
    "sender": "4575517562750960384",
    "senderRS": "S-C2S2-ZERP-XRPG-52WZY",
    "height": 1455361,
    "version": 2,
    "ecBlockId": "5277218634261349155",
    "ecBlockHeight": 1455349,
    "cashBackId": "6815821449111209138",
    "block": "8188888340404756158",
    "confirmations": 33977,
    "blockTimestamp": 350887057,
    "requestProcessingTime": 8
}

// @ts-ignore
const Message = {
    "type": 1,
    "subtype": 0,
    "timestamp": 358783639,
    "deadline": 20,
    "senderPublicKey": "2090fdbac5d520b8b900bc250785736c8e280a22c6444fb380be1f355c37d26b",
    "recipient": "8999741399032476831",
    "recipientRS": "S-CF6Z-5UMV-NKZZ-93ETT",
    "amountNQT": "0",
    "feeNQT": "4000000",
    "signature": "d1511b3928c4fb3544f8419dc17971287f544111997b2061dff05d345b82eb0507bd77dc2b1a571f7e3e37f5da0b8fd7c1bcadd71d9e59a4724c4b4bffc33e84",
    "signatureHash": "2b08d4f6e950d9fe58ea95bdac395a42c2eed77a557f39b4eacd605155564626",
    "fullHash": "a0d8b8e7a54f1cb8772624092931af5a56e10ec8ebd5bdcdcce41d7816f2c5c1",
    "transaction": "13266566176302487712",
    "attachment": {
        "version.Message": 1,
        "message": "{\"market\":\"2\",\"rate\":\"72500\"}",
        "messageIsText": true
        // "message": "2b08d4f6e950d9fe58ea95bdac395a42c2eed77a557f39b4eacd605155564626".repeat(10),
        // "messageIsText": false
    },
    "attachmentBytes": "011d0000807b226d61726b6574223a2232222c2272617465223a223732353030227d",
    "sender": "14824288707213599573",
    "senderRS": "S-UAUP-37NN-K8KZ-ENMGV",
    "height": 1488241,
    "version": 2,
    "ecBlockId": "16573429253419650671",
    "ecBlockHeight": 1488230,
    "cashBackId": "14824288707213599573",
    "block": "537673217012198433",
    "confirmations": 1101,
    "blockTimestamp": 358783661,
    "requestProcessingTime": 2
}


const JoinPool = {
    "type": 20,
    "subtype": 0,
    "timestamp": 358951372,
    "deadline": 1440,
    "senderPublicKey": "58efa1ddb9df42f6e30c7546ecbd106a084308596243b7a82f2b9a071ec01b5e",
    "recipient": "11055356809051900004",
    "recipientRS": "S-S456-G8QD-HZQ7-B66VL",
    "amountNQT": "0",
    "feeNQT": "1000000",
    "signature": "81760479f7e0ba94efd213b4197e3187f8156585ae502089a6d831b99aba340fe77a75f43ddb8138bcc97ef9ad35b2f4ddc7e52fb92e870472f69c108b0a559e",
    "signatureHash": "44fdbf69d8915f7ac1025b856d4cfa975836504ba4e99c99f632948f827b2c84",
    "fullHash": "7f2092f5dc021d501de38574634b885d9a95e46b9b76d19d2f86968e762dcbde",
    "transaction": "5772773445394899071",
    "attachment": {
        "version.RewardRecipientAssignment": 1
    },
    "attachmentBytes": "01",
    "sender": "11193340718119171506",
    "senderRS": "S-KFFL-4J6Q-5TZX-BWPPQ",
    "height": 1488942,
    "version": 2,
    "ecBlockId": "15592949142302668280",
    "ecBlockHeight": 1488931,
    "cashBackId": "13420738867631717395",
    "block": "8150343049528619316",
    "confirmations": 413,
    "blockTimestamp": 358951517,
    "requestProcessingTime": 4
}

export default function Screen() {
    return (
        <ProtectedScreen>
            {/* @ts-ignore*/}
            <TransactionPreviewSection transaction={JoinPool} />
        </ProtectedScreen>
    );
}
