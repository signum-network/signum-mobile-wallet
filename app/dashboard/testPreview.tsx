/* @ts-nocheck */


import {ProtectedScreen} from "@/features/Dashboard/components/ProtectedScreen";
import {TransactionPreview} from "@/features/Dashboard/Deeplinking/Sign/sections/TransactionPreview";
import type {Transaction} from "@signumjs/core";

// @ts-ignore
const TestTransaction: Transaction = {
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

export default function Screen() {
    return (
        <ProtectedScreen>
            {/* @ts-ignore*/}
            <TransactionPreview transaction={TokenMint} />
        </ProtectedScreen>
    );
}
