import { BigInt } from "@graphprotocol/graph-ts"

import {
  MokaForumPosts,
  postCreated,
  postUpvoted
} from "../generated/MokaForumPosts/MokaForumPosts"

import {
  MokaForum,
  SettledDailyPrize,
  SettledMonthlyPrize,
  SettledWeeklyPrize
} from "../generated/MokaForum/MokaForum"

import {
  Forum,
  ForumPostDayMapping,
  ForumPostWeekMapping,
  ForumPostMonthMapping,
  Post,
  User,
  Upvote,
  Leaderboard,
  LeaderboardPayout
} from "../generated/schema"

export function handlepostCreated(event: postCreated): void {
  let params = event.params;
  let contract = MokaForumPosts.bind(event.address);
  let forumId = contract.parentUid();
  let userId = params.post.user.toHexString();

  let forumMonthId = forumId + '_' + params.post.monthBlock;
  let forumWeekId = forumId + '_' + params.post.weekBlock;
  let forumDayId = forumId + '_' + params.post.dayBlock;

  let forum = Forum.load(forumId);
  let forumMonth = ForumPostMonthMapping.load(forumMonthId);
  let forumWeek = ForumPostWeekMapping.load(forumWeekId);
  let forumDay = ForumPostDayMapping.load(forumDayId);
  let user = User.load(userId);

  if (forum == null) {
    forum = new Forum(forumId);
  }

  if (forumMonth == null) {
    forumMonth = new ForumPostMonthMapping(forumMonthId);
    forumMonth.rewards = BigInt.fromI32(0);
  }

  if (forumWeek == null) {
    forumWeek = new ForumPostWeekMapping(forumWeekId);
    forumWeek.rewards = BigInt.fromI32(0);
  }

  if (forumDay == null) {
    forumDay = new ForumPostDayMapping(forumDayId);
    forumDay.rewards = BigInt.fromI32(0);
  }

  if (user == null) {
    user = new User(userId);
    user.tokenRewards = BigInt.fromI32(0);
    user.tokenSpent = BigInt.fromI32(0);
  }

  let post = new Post(forumId + '_' + params.id.toString());
  post.upvotes = BigInt.fromI32(0);
  post.forum = forum.id;
  post.monthId = forumMonth.id;
  post.weekId = forumWeek.id;
  post.dayId = forumDay.id;
  post.timestamp = event.block.timestamp;
  post.user = userId;
  post.title = params.post.title;
  post.desc = params.post.desc;
  post.url = params.post.url;
  post.tags = params.post.tags;

  user.tokenSpent = user.tokenSpent.plus(BigInt.fromI32(6));
  forumMonth.rewards = forumMonth.rewards.plus(BigInt.fromI32(2));
  forumWeek.rewards = forumWeek.rewards.plus(BigInt.fromI32(2));
  forumDay.rewards = forumDay.rewards.plus(BigInt.fromI32(2));

  forum.save();
  forumMonth.save();
  forumWeek.save();
  forumDay.save();
  post.save();
  user.save();
}

export function handlepostUpvoted(event: postUpvoted): void {
  let params = event.params;
  let contract = MokaForumPosts.bind(event.address);
  let forumId = contract.parentUid();

  let post = Post.load(forumId + '_' + params.postId.toString());

  if (post) {
    let userVoter = User.load(params.voter.toHexString());
    let userVoted = User.load(post.user);
  
    if (userVoter == null) {
      userVoter = new User(params.voter.toHexString());
      userVoter.tokenRewards = BigInt.fromI32(0);
      userVoter.tokenSpent = BigInt.fromI32(0);
    }
  
    if (userVoted == null) {
      userVoted = new User(post.user);
      userVoted.tokenRewards = BigInt.fromI32(0);
      userVoted.tokenSpent = BigInt.fromI32(0);
    }
  
    post.upvotes = post.upvotes.plus(BigInt.fromI32(1));
    userVoter.tokenSpent = userVoter.tokenSpent.plus(BigInt.fromI32(1));
    userVoted.tokenRewards = userVoted.tokenRewards.plus(BigInt.fromI32(1));

    let upvote = new Upvote(params.voter.toHexString() + '_' + forumId + '_' + params.postId.toString());
    upvote.timestamp = event.block.timestamp;
    upvote.user = userVoter.id;
    upvote.userId = userVoter.id;
    upvote.post = post.id;
    upvote.postId = post.id;

    post.save();
    userVoter.save();
    userVoted.save();
    upvote.save();
  }
}

export function handleSettledDailyPrize(event: SettledDailyPrize): void {
  let params = event.params;
  let contract = MokaForum.bind(event.address);
  let forumId = contract.uid();
  let leaderboardId = forumId + '_' + params.dailyId + '_day';
  let leaderboard = new Leaderboard(leaderboardId);
  let totalRewards = BigInt.fromI32(0);

  for (var i = 0; i < params.param1.length; i++) {
    let data = params.param1[i];
    let leaderboardPayout = new LeaderboardPayout(leaderboardId + '_' + (i + 1).toString());
    leaderboardPayout.leaderboardId = leaderboardId;
    leaderboardPayout.rank = data.rank;
    leaderboardPayout.user = data.user.toHexString();
    leaderboardPayout.post = forumId + '_' + data.postId.toString();
    leaderboardPayout.reward = data.prize;

    totalRewards = totalRewards.plus(data.prize);
    leaderboardPayout.save();
  }

  leaderboard.reward = totalRewards;
  leaderboard.save();
}

export function handleSettledWeeklyPrize(event: SettledWeeklyPrize): void {
  let params = event.params;
  let contract = MokaForum.bind(event.address);
  let forumId = contract.uid();
  let leaderboardId = forumId + '_' + params.weeklyId + '_week';
  let leaderboard = new Leaderboard(leaderboardId);
  let totalRewards = BigInt.fromI32(0);

  for (var i = 0; i < params.param1.length; i++) {
    let data = params.param1[i];
    let leaderboardPayout = new LeaderboardPayout(leaderboardId + '_' + (i + 1).toString());
    leaderboardPayout.leaderboardId = leaderboardId;
    leaderboardPayout.rank = data.rank;
    leaderboardPayout.user = data.user.toHexString();
    leaderboardPayout.post = forumId + '_' + data.postId.toString();
    leaderboardPayout.reward = data.prize;

    totalRewards = totalRewards.plus(data.prize);
    leaderboardPayout.save();
  }

  leaderboard.reward = totalRewards;
  leaderboard.save();
}

export function handleSettledMonthlyPrize(event: SettledMonthlyPrize): void {
  let params = event.params;
  let contract = MokaForum.bind(event.address);
  let forumId = contract.uid();
  let leaderboardId = forumId + '_' + params.monthlyId + '_month';
  let leaderboard = new Leaderboard(leaderboardId);
  let totalRewards = BigInt.fromI32(0);

  for (var i = 0; i < params.param1.length; i++) {
    let data = params.param1[i];
    let leaderboardPayout = new LeaderboardPayout(leaderboardId + '_' + (i + 1).toString());
    leaderboardPayout.leaderboardId = leaderboardId;
    leaderboardPayout.rank = data.rank;
    leaderboardPayout.user = data.user.toHexString();
    leaderboardPayout.post = forumId + '_' + data.postId.toString();
    leaderboardPayout.reward = data.prize;

    totalRewards = totalRewards.plus(data.prize);
    leaderboardPayout.save();
  }

  leaderboard.reward = totalRewards;
  leaderboard.save();
}
