// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class postCreated extends ethereum.Event {
  get params(): postCreated__Params {
    return new postCreated__Params(this);
  }
}

export class postCreated__Params {
  _event: postCreated;

  constructor(event: postCreated) {
    this._event = event;
  }

  get uid(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get post(): postCreatedPostStruct {
    return changetype<postCreatedPostStruct>(
      this._event.parameters[1].value.toTuple()
    );
  }
}

export class postCreatedPostStruct extends ethereum.Tuple {
  get uid(): BigInt {
    return this[0].toBigInt();
  }

  get upvotes(): BigInt {
    return this[1].toBigInt();
  }

  get monthId(): Bytes {
    return this[2].toBytes();
  }

  get weekId(): Bytes {
    return this[3].toBytes();
  }

  get dayId(): Bytes {
    return this[4].toBytes();
  }

  get timestamp(): BigInt {
    return this[5].toBigInt();
  }

  get user(): Address {
    return this[6].toAddress();
  }

  get post(): string {
    return this[7].toString();
  }

  get tags(): Array<string> {
    return this[8].toStringArray();
  }
}

export class postUpvoted extends ethereum.Event {
  get params(): postUpvoted__Params {
    return new postUpvoted__Params(this);
  }
}

export class postUpvoted__Params {
  _event: postUpvoted;

  constructor(event: postUpvoted) {
    this._event = event;
  }

  get uid(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get voter(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class MokaPosts__createPostResult {
  value0: boolean;
  value1: BigInt;

  constructor(value0: boolean, value1: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromBoolean(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    return map;
  }
}

export class MokaPosts__postsResult {
  value0: BigInt;
  value1: BigInt;
  value2: Bytes;
  value3: Bytes;
  value4: Bytes;
  value5: BigInt;
  value6: Address;
  value7: string;

  constructor(
    value0: BigInt,
    value1: BigInt,
    value2: Bytes,
    value3: Bytes,
    value4: Bytes,
    value5: BigInt,
    value6: Address,
    value7: string
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
    this.value6 = value6;
    this.value7 = value7;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromFixedBytes(this.value2));
    map.set("value3", ethereum.Value.fromFixedBytes(this.value3));
    map.set("value4", ethereum.Value.fromFixedBytes(this.value4));
    map.set("value5", ethereum.Value.fromUnsignedBigInt(this.value5));
    map.set("value6", ethereum.Value.fromAddress(this.value6));
    map.set("value7", ethereum.Value.fromString(this.value7));
    return map;
  }
}

export class MokaPosts extends ethereum.SmartContract {
  static bind(address: Address): MokaPosts {
    return new MokaPosts("MokaPosts", address);
  }

  createPost(
    _creator: Address,
    _monthId: Bytes,
    _weekId: Bytes,
    _dayId: Bytes,
    _post: string,
    _tags: Array<string>
  ): MokaPosts__createPostResult {
    let result = super.call(
      "createPost",
      "createPost(address,bytes32,bytes32,bytes32,string,string[]):(bool,uint256)",
      [
        ethereum.Value.fromAddress(_creator),
        ethereum.Value.fromFixedBytes(_monthId),
        ethereum.Value.fromFixedBytes(_weekId),
        ethereum.Value.fromFixedBytes(_dayId),
        ethereum.Value.fromString(_post),
        ethereum.Value.fromStringArray(_tags)
      ]
    );

    return new MokaPosts__createPostResult(
      result[0].toBoolean(),
      result[1].toBigInt()
    );
  }

  try_createPost(
    _creator: Address,
    _monthId: Bytes,
    _weekId: Bytes,
    _dayId: Bytes,
    _post: string,
    _tags: Array<string>
  ): ethereum.CallResult<MokaPosts__createPostResult> {
    let result = super.tryCall(
      "createPost",
      "createPost(address,bytes32,bytes32,bytes32,string,string[]):(bool,uint256)",
      [
        ethereum.Value.fromAddress(_creator),
        ethereum.Value.fromFixedBytes(_monthId),
        ethereum.Value.fromFixedBytes(_weekId),
        ethereum.Value.fromFixedBytes(_dayId),
        ethereum.Value.fromString(_post),
        ethereum.Value.fromStringArray(_tags)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new MokaPosts__createPostResult(value[0].toBoolean(), value[1].toBigInt())
    );
  }

  mokaERC20Contract(): Address {
    let result = super.call(
      "mokaERC20Contract",
      "mokaERC20Contract():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_mokaERC20Contract(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "mokaERC20Contract",
      "mokaERC20Contract():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  postUpvotes(param0: Address, param1: BigInt): boolean {
    let result = super.call(
      "postUpvotes",
      "postUpvotes(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );

    return result[0].toBoolean();
  }

  try_postUpvotes(
    param0: Address,
    param1: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "postUpvotes",
      "postUpvotes(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  posts(param0: BigInt): MokaPosts__postsResult {
    let result = super.call(
      "posts",
      "posts(uint256):(uint256,uint32,bytes32,bytes32,bytes32,uint256,address,string)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return new MokaPosts__postsResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBytes(),
      result[3].toBytes(),
      result[4].toBytes(),
      result[5].toBigInt(),
      result[6].toAddress(),
      result[7].toString()
    );
  }

  try_posts(param0: BigInt): ethereum.CallResult<MokaPosts__postsResult> {
    let result = super.tryCall(
      "posts",
      "posts(uint256):(uint256,uint32,bytes32,bytes32,bytes32,uint256,address,string)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new MokaPosts__postsResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBytes(),
        value[3].toBytes(),
        value[4].toBytes(),
        value[5].toBigInt(),
        value[6].toAddress(),
        value[7].toString()
      )
    );
  }

  uid(): BigInt {
    let result = super.call("uid", "uid():(uint256)", []);

    return result[0].toBigInt();
  }

  try_uid(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("uid", "uid():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  upvotePost(_voter: Address, _creator: Address, _uid: BigInt): boolean {
    let result = super.call(
      "upvotePost",
      "upvotePost(address,address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(_voter),
        ethereum.Value.fromAddress(_creator),
        ethereum.Value.fromUnsignedBigInt(_uid)
      ]
    );

    return result[0].toBoolean();
  }

  try_upvotePost(
    _voter: Address,
    _creator: Address,
    _uid: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "upvotePost",
      "upvotePost(address,address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(_voter),
        ethereum.Value.fromAddress(_creator),
        ethereum.Value.fromUnsignedBigInt(_uid)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _mokaERC20Contract(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class CreatePostCall extends ethereum.Call {
  get inputs(): CreatePostCall__Inputs {
    return new CreatePostCall__Inputs(this);
  }

  get outputs(): CreatePostCall__Outputs {
    return new CreatePostCall__Outputs(this);
  }
}

export class CreatePostCall__Inputs {
  _call: CreatePostCall;

  constructor(call: CreatePostCall) {
    this._call = call;
  }

  get _creator(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _monthId(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get _weekId(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }

  get _dayId(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }

  get _post(): string {
    return this._call.inputValues[4].value.toString();
  }

  get _tags(): Array<string> {
    return this._call.inputValues[5].value.toStringArray();
  }
}

export class CreatePostCall__Outputs {
  _call: CreatePostCall;

  constructor(call: CreatePostCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }

  get value1(): BigInt {
    return this._call.outputValues[1].value.toBigInt();
  }
}

export class UpvotePostCall extends ethereum.Call {
  get inputs(): UpvotePostCall__Inputs {
    return new UpvotePostCall__Inputs(this);
  }

  get outputs(): UpvotePostCall__Outputs {
    return new UpvotePostCall__Outputs(this);
  }
}

export class UpvotePostCall__Inputs {
  _call: UpvotePostCall;

  constructor(call: UpvotePostCall) {
    this._call = call;
  }

  get _voter(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _creator(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _uid(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class UpvotePostCall__Outputs {
  _call: UpvotePostCall;

  constructor(call: UpvotePostCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}
