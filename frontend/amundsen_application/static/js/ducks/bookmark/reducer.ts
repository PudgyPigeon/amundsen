import { Bookmark, ResourceType, ResourceDict } from 'interfaces';

import {
  AddBookmark,
  AddBookmarkRequest,
  AddBookmarkResponse,
  GetBookmarks,
  GetBookmarksRequest,
  GetBookmarksResponse,
  GetBookmarksForUser,
  GetBookmarksForUserRequest,
  GetBookmarksForUserResponse,
  RemoveBookmark,
  RemoveBookmarkRequest,
  RemoveBookmarkResponse,
} from './types';

/* ACTIONS */
export function addBookmark(resourceKey: string, resourceType: ResourceType): AddBookmarkRequest {
  return {
    payload: {
      resourceKey,
      resourceType,
    },
    type: AddBookmark.REQUEST,
  }
}
export function addBookmarkFailure(): AddBookmarkResponse {
  return { type: AddBookmark.FAILURE };
}
export function addBookmarkSuccess(bookmarks: ResourceDict<Bookmark[]>): AddBookmarkResponse {
  return { type: AddBookmark.SUCCESS, payload: { bookmarks } };
}

export function removeBookmark(resourceKey: string, resourceType: ResourceType): RemoveBookmarkRequest {
  return {
    payload: {
      resourceKey,
      resourceType,
    },
    type: RemoveBookmark.REQUEST,
  }
}
export function removeBookmarkFailure(): RemoveBookmarkResponse {
  return { type: RemoveBookmark.FAILURE };
}
export function removeBookmarkSuccess(resourceKey: string, resourceType: ResourceType): RemoveBookmarkResponse {
  return { type: RemoveBookmark.SUCCESS, payload: { resourceKey, resourceType } };
}

export function getBookmarks(): GetBookmarksRequest {
  return {
    type: GetBookmarks.REQUEST,
  }
}
export function getBookmarksFailure(): GetBookmarksResponse {
  return { type: GetBookmarks.FAILURE };
}
export function getBookmarksSuccess(bookmarks: ResourceDict<Bookmark[]>): GetBookmarksResponse {
  return { type: GetBookmarks.SUCCESS, payload: { bookmarks } };
}

export function getBookmarksForUser(userId: string): GetBookmarksForUserRequest {
  return {
    payload: {
      userId,
    },
    type: GetBookmarksForUser.REQUEST,
  }
}
export function getBookmarksForUserFailure(): GetBookmarksForUserResponse {
  return { type: GetBookmarksForUser.FAILURE };
}
export function getBookmarksForUserSuccess(bookmarks: ResourceDict<Bookmark[]>): GetBookmarksForUserResponse {
  return { type: GetBookmarksForUser.SUCCESS, payload: { bookmarks } };
}

/* REDUCER */
export interface BookmarkReducerState {
  myBookmarks: ResourceDict<Bookmark[]>;
  myBookmarksIsLoaded: boolean;
  bookmarksForUser: ResourceDict<Bookmark[]>;
}
export const initialBookmarkState = {
  [ResourceType.table]: [],
  [ResourceType.dashboard]: [],
}
export const initialState: BookmarkReducerState = {
  myBookmarks: {
    ...initialBookmarkState
  },
  myBookmarksIsLoaded: false,
  bookmarksForUser: {
    ...initialBookmarkState,
  },
};

export default function reducer(state: BookmarkReducerState = initialState, action): BookmarkReducerState {
  switch(action.type) {
    case AddBookmark.SUCCESS:
    case GetBookmarks.SUCCESS:
      return {
        ...state,
        myBookmarks: (<GetBookmarksResponse>action).payload.bookmarks,
        myBookmarksIsLoaded: true,
      };
    case GetBookmarksForUser.REQUEST:
      return {
        ...state,
        bookmarksForUser: {
          ...initialBookmarkState
        }
      };
    case GetBookmarksForUser.SUCCESS:
      return {
        ...state,
        bookmarksForUser: (<GetBookmarksForUserResponse>action).payload.bookmarks,
      };
    case RemoveBookmark.SUCCESS:
      const { resourceKey, resourceType } = (<RemoveBookmarkResponse>action).payload;
      return {
        ...state,
        myBookmarks: {
          ...state.myBookmarks,
          [resourceType]: state.myBookmarks[resourceType].filter((bookmark) => bookmark.key !== resourceKey)
        }
      };
    case AddBookmark.FAILURE:
    case GetBookmarks.FAILURE:
    case GetBookmarksForUser.FAILURE:
    case RemoveBookmark.FAILURE:
    default:
      return state;
  }
}
