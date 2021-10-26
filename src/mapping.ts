import { BigInt } from "@graphprotocol/graph-ts"

import {
  MokaPosts,
  postCreated,
  postUpvoted
} from "../generated/MokaPosts/MokaPosts"

import {
  MokaToken,
  SettledDailyPrize,
  SettledMonthlyPrize,
  SettledWeeklyPrize
} from "../generated/MokaToken/MokaToken"

import {
  PostDayMapping,
  PostWeekMapping,
  PostMonthMapping,
  Post,
  User,
  UserActivity,
  Upvote,
  Leaderboard,
  LeaderboardPayout
} from "../generated/schema"

export function handlepostCreated(event: postCreated): void {
  let params = event.params;
  let userId = params.post.user.toHexString();

  let monthId = params.post.monthId.toString();
  let weekId = params.post.weekId.toString();
  let dayId = params.post.dayId.toString();

  let monthMapping = PostMonthMapping.load(monthId);
  let weekMapping = PostWeekMapping.load(weekId);
  let dayMapping = PostDayMapping.load(dayId);
  let user = User.load(userId);

  if (monthMapping == null) {
    monthMapping = new PostMonthMapping(monthId);
    monthMapping.rewards = BigInt.fromI32(0);
  }

  if (weekMapping == null) {
    weekMapping = new PostWeekMapping(weekId);
    weekMapping.rewards = BigInt.fromI32(0);
  }

  if (dayMapping == null) {
    dayMapping = new PostDayMapping(dayId);
    dayMapping.rewards = BigInt.fromI32(0);
  }

  if (user == null) {
    user = new User(userId);
    user.tokenRewards = BigInt.fromI32(0);
    user.tokenSpent = BigInt.fromI32(0);
  }

  let post = new Post(params.uid.toString());
  post.upvotes = BigInt.fromI32(0);
  post.monthId = monthId;
  post.weekId = weekId;
  post.dayId = dayId;
  post.timestamp = params.post.timestamp;
  post.user = userId;
  post.post = params.post.post;
  post.tags = params.post.tags;

  let newUserActivity = new UserActivity(event.transaction.hash.toHex());
  newUserActivity.type = 'post';
  newUserActivity.user = userId;
  newUserActivity.timestamp = event.block.timestamp;
  newUserActivity.post = params.uid.toString();

  user.tokenSpent = user.tokenSpent.plus(BigInt.fromString('6000000000000000000'));

  monthMapping.rewards = monthMapping.rewards.plus(BigInt.fromI32(2));
  weekMapping.rewards = weekMapping.rewards.plus(BigInt.fromI32(2));
  dayMapping.rewards = dayMapping.rewards.plus(BigInt.fromI32(2));

  monthMapping.save();
  weekMapping.save();
  dayMapping.save();

  post.save();
  user.save();
  newUserActivity.save();
}

export function handlepostUpvoted(event: postUpvoted): void {
  let params = event.params;

  let post = Post.load(params.uid.toString());

  if (post) {
    let voter = User.load(params.voter.toHexString());
    let creator = User.load(post.user);
  
    if (voter == null) {
      voter = new User(params.voter.toHexString());
      voter.tokenRewards = BigInt.fromI32(0);
      voter.tokenSpent = BigInt.fromI32(0);
    }
  
    if (creator == null) {
      creator = new User(post.user);
      creator.tokenRewards = BigInt.fromI32(0);
      creator.tokenSpent = BigInt.fromI32(0);
    }
  
    post.upvotes = post.upvotes.plus(BigInt.fromI32(1));
    voter.tokenSpent = voter.tokenSpent.plus(BigInt.fromString('1000000000000000000'));
    creator.tokenRewards = creator.tokenRewards.plus(BigInt.fromString('1000000000000000000'));

    let upvote = new Upvote(params.voter.toHexString() + '_' + params.uid.toString());
    upvote.timestamp = event.block.timestamp;
    upvote.voter = voter.id;
    upvote.voterId = voter.id;
    upvote.creator = creator.id;
    upvote.creatorId = creator.id;
    upvote.post = post.id;
    upvote.postId = post.id;

    let newUserActivity = new UserActivity(event.transaction.hash.toHex() + '_1');
    newUserActivity.type = 'upvote';
    newUserActivity.user = voter.id;
    newUserActivity.timestamp = event.block.timestamp;
    newUserActivity.upvote = params.voter.toHexString() + '_' + params.uid.toString();

    let newUserActivityB = new UserActivity(event.transaction.hash.toHex() + '_2');
    newUserActivityB.type = 'upvote-receive';
    newUserActivityB.user = creator.id;
    newUserActivityB.timestamp = event.block.timestamp;
    newUserActivityB.upvote = params.voter.toHexString() + '_' + params.uid.toString();

    post.save();
    voter.save();
    creator.save();
    upvote.save();
    newUserActivity.save();
    newUserActivityB.save();
  }
}

export function handleSettledDailyPrize(event: SettledDailyPrize): void {
  let params = event.params;
  let leaderboardId = params.dailyId.toString() + '_day';
  let leaderboard = new Leaderboard(leaderboardId);
  let totalRewards = BigInt.fromI32(0);

  for (var i = 0; i < params.param1.length; i++) {
    let data = params.param1[i];
    let leaderboardPayout = new LeaderboardPayout(leaderboardId + '_' + (i + 1).toString());
    leaderboardPayout.leaderboardId = leaderboardId;
    leaderboardPayout.type = 'daily';
    leaderboardPayout.rank = data.rank;
    leaderboardPayout.user = data.user.toHexString();
    leaderboardPayout.post = data.postId.toString();
    leaderboardPayout.reward = data.prize;

    let user = User.load(data.user.toHexString());

    if (user == null) {
      user = new User(data.user.toHexString());
      user.tokenRewards = BigInt.fromI32(0);
      user.tokenSpent = BigInt.fromI32(0);
    }

    user.tokenRewards = user.tokenRewards.plus(data.prize);

    let newUserActivity = new UserActivity(event.transaction.hash.toHex() + '_' + (i + 1).toString());
    newUserActivity.type = 'reward-daily';
    newUserActivity.user = data.user.toHexString();
    newUserActivity.timestamp = event.block.timestamp;
    newUserActivity.reward = leaderboardId + '_' + (i + 1).toString();

    totalRewards = totalRewards.plus(data.prize);
    leaderboardPayout.save();
    user.save();
    newUserActivity.save();
  }

  leaderboard.reward = totalRewards;
  leaderboard.save();
}

export function handleSettledWeeklyPrize(event: SettledWeeklyPrize): void {
  let params = event.params;
  let leaderboardId = params.weeklyId.toString() + '_week';
  let leaderboard = new Leaderboard(leaderboardId);
  let totalRewards = BigInt.fromI32(0);

  for (var i = 0; i < params.param1.length; i++) {
    let data = params.param1[i];
    let leaderboardPayout = new LeaderboardPayout(leaderboardId + '_' + (i + 1).toString());
    leaderboardPayout.leaderboardId = leaderboardId;
    leaderboardPayout.type = 'weekly';
    leaderboardPayout.rank = data.rank;
    leaderboardPayout.user = data.user.toHexString();
    leaderboardPayout.post = data.postId.toString();
    leaderboardPayout.reward = data.prize;

    let user = User.load(data.user.toHexString());

    if (user == null) {
      user = new User(data.user.toHexString());
      user.tokenRewards = BigInt.fromI32(0);
      user.tokenSpent = BigInt.fromI32(0);
    }

    user.tokenRewards = user.tokenRewards.plus(data.prize);

    let newUserActivity = new UserActivity(event.transaction.hash.toHex() + '_' + (i + 1).toString());
    newUserActivity.type = 'reward-weekly';
    newUserActivity.user = data.user.toHexString();
    newUserActivity.timestamp = event.block.timestamp;
    newUserActivity.reward = leaderboardId + '_' + (i + 1).toString();

    totalRewards = totalRewards.plus(data.prize);
    leaderboardPayout.save();
    user.save();
    newUserActivity.save();
  }

  leaderboard.reward = totalRewards;
  leaderboard.save();
}

export function handleSettledMonthlyPrize(event: SettledMonthlyPrize): void {
  let params = event.params;
  let leaderboardId = params.monthlyId.toString() + '_month';
  let leaderboard = new Leaderboard(leaderboardId);
  let totalRewards = BigInt.fromI32(0);

  for (var i = 0; i < params.param1.length; i++) {
    let data = params.param1[i];
    let leaderboardPayout = new LeaderboardPayout(leaderboardId + '_' + (i + 1).toString());
    leaderboardPayout.leaderboardId = leaderboardId;
    leaderboardPayout.type = 'monthly';
    leaderboardPayout.rank = data.rank;
    leaderboardPayout.user = data.user.toHexString();
    leaderboardPayout.post = data.postId.toString();
    leaderboardPayout.reward = data.prize;

    let user = User.load(data.user.toHexString());

    if (user == null) {
      user = new User(data.user.toHexString());
      user.tokenRewards = BigInt.fromI32(0);
      user.tokenSpent = BigInt.fromI32(0);
    }

    user.tokenRewards = user.tokenRewards.plus(data.prize);

    let newUserActivity = new UserActivity(event.transaction.hash.toHex() + '_' + (i + 1).toString());
    newUserActivity.type = 'reward-monthly';
    newUserActivity.user = data.user.toHexString();
    newUserActivity.timestamp = event.block.timestamp;
    newUserActivity.reward = leaderboardId + '_' + (i + 1).toString();

    totalRewards = totalRewards.plus(data.prize);
    leaderboardPayout.save();
    user.save();
    newUserActivity.save();
  }

  leaderboard.reward = totalRewards;
  leaderboard.save();
}
