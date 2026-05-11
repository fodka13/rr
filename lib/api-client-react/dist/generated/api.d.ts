import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AuthResponse, Blog, BlogListResponse, Category, Comment, CommentListResponse, CreateBlogBody, CreateCategoryBody, CreateCommentBody, CreateWorkBody, ErrorEnvelope, ErrorResponse, HealthStatus, LikeResponse, ListBlogsParams, ListCategoriesParams, ListCommentsParams, ListUsersParams, ListWorksParams, LoginBody, MessageResponse, RegisterBody, ReorderCategoriesBody, SetFeaturedLogosBody, SiteStats, UpdateBlogBody, UpdateCategoryBody, UpdateUserBody, UpdateWorkBody, UploadUrlRequest, UploadUrlResponse, User, UserListResponse, Work, WorkListResponse } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Register a new user
 */
export declare const getRegisterUrl: () => string;
export declare const register: (registerBody: RegisterBody, options?: RequestInit) => Promise<AuthResponse>;
export declare const getRegisterMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
        data: BodyType<RegisterBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
    data: BodyType<RegisterBody>;
}, TContext>;
export type RegisterMutationResult = NonNullable<Awaited<ReturnType<typeof register>>>;
export type RegisterMutationBody = BodyType<RegisterBody>;
export type RegisterMutationError = ErrorType<unknown>;
/**
 * @summary Register a new user
 */
export declare const useRegister: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
        data: BodyType<RegisterBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof register>>, TError, {
    data: BodyType<RegisterBody>;
}, TContext>;
/**
 * @summary Login
 */
export declare const getLoginUrl: () => string;
export declare const login: (loginBody: LoginBody, options?: RequestInit) => Promise<AuthResponse>;
export declare const getLoginMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginBody>;
}, TContext>;
export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>;
export type LoginMutationBody = BodyType<LoginBody>;
export type LoginMutationError = ErrorType<unknown>;
/**
 * @summary Login
 */
export declare const useLogin: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginBody>;
}, TContext>;
/**
 * @summary Logout
 */
export declare const getLogoutUrl: () => string;
export declare const logout: (options?: RequestInit) => Promise<MessageResponse>;
export declare const getLogoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
export type LogoutMutationResult = NonNullable<Awaited<ReturnType<typeof logout>>>;
export type LogoutMutationError = ErrorType<unknown>;
/**
 * @summary Logout
 */
export declare const useLogout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
/**
 * @summary Get current user
 */
export declare const getGetMeUrl: () => string;
export declare const getMe: (options?: RequestInit) => Promise<User>;
export declare const getGetMeQueryKey: () => readonly ["/api/auth/me"];
export declare const getGetMeQueryOptions: <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>;
export type GetMeQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get current user
 */
export declare function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all users (admin only)
 */
export declare const getListUsersUrl: (params?: ListUsersParams) => string;
export declare const listUsers: (params?: ListUsersParams, options?: RequestInit) => Promise<UserListResponse>;
export declare const getListUsersQueryKey: (params?: ListUsersParams) => readonly ["/api/users", ...ListUsersParams[]];
export declare const getListUsersQueryOptions: <TData = Awaited<ReturnType<typeof listUsers>>, TError = ErrorType<unknown>>(params?: ListUsersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListUsersQueryResult = NonNullable<Awaited<ReturnType<typeof listUsers>>>;
export type ListUsersQueryError = ErrorType<unknown>;
/**
 * @summary List all users (admin only)
 */
export declare function useListUsers<TData = Awaited<ReturnType<typeof listUsers>>, TError = ErrorType<unknown>>(params?: ListUsersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetUserUrl: (id: number) => string;
export declare const getUser: (id: number, options?: RequestInit) => Promise<User>;
export declare const getGetUserQueryKey: (id: number) => readonly [`/api/users/${number}`];
export declare const getGetUserQueryOptions: <TData = Awaited<ReturnType<typeof getUser>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetUserQueryResult = NonNullable<Awaited<ReturnType<typeof getUser>>>;
export type GetUserQueryError = ErrorType<unknown>;
export declare function useGetUser<TData = Awaited<ReturnType<typeof getUser>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateUserUrl: (id: number) => string;
export declare const updateUser: (id: number, updateUserBody: UpdateUserBody, options?: RequestInit) => Promise<User>;
export declare const getUpdateUserMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
        id: number;
        data: BodyType<UpdateUserBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
    id: number;
    data: BodyType<UpdateUserBody>;
}, TContext>;
export type UpdateUserMutationResult = NonNullable<Awaited<ReturnType<typeof updateUser>>>;
export type UpdateUserMutationBody = BodyType<UpdateUserBody>;
export type UpdateUserMutationError = ErrorType<unknown>;
export declare const useUpdateUser: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
        id: number;
        data: BodyType<UpdateUserBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateUser>>, TError, {
    id: number;
    data: BodyType<UpdateUserBody>;
}, TContext>;
export declare const getBanUserUrl: (id: number) => string;
export declare const banUser: (id: number, options?: RequestInit) => Promise<MessageResponse>;
export declare const getBanUserMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof banUser>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof banUser>>, TError, {
    id: number;
}, TContext>;
export type BanUserMutationResult = NonNullable<Awaited<ReturnType<typeof banUser>>>;
export type BanUserMutationError = ErrorType<unknown>;
export declare const useBanUser: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof banUser>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof banUser>>, TError, {
    id: number;
}, TContext>;
export declare const getUnbanUserUrl: (id: number) => string;
export declare const unbanUser: (id: number, options?: RequestInit) => Promise<MessageResponse>;
export declare const getUnbanUserMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof unbanUser>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof unbanUser>>, TError, {
    id: number;
}, TContext>;
export type UnbanUserMutationResult = NonNullable<Awaited<ReturnType<typeof unbanUser>>>;
export type UnbanUserMutationError = ErrorType<unknown>;
export declare const useUnbanUser: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof unbanUser>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof unbanUser>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List all categories
 */
export declare const getListCategoriesUrl: (params?: ListCategoriesParams) => string;
export declare const listCategories: (params?: ListCategoriesParams, options?: RequestInit) => Promise<Category[]>;
export declare const getListCategoriesQueryKey: (params?: ListCategoriesParams) => readonly ["/api/categories", ...ListCategoriesParams[]];
export declare const getListCategoriesQueryOptions: <TData = Awaited<ReturnType<typeof listCategories>>, TError = ErrorType<unknown>>(params?: ListCategoriesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCategories>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listCategories>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCategoriesQueryResult = NonNullable<Awaited<ReturnType<typeof listCategories>>>;
export type ListCategoriesQueryError = ErrorType<unknown>;
/**
 * @summary List all categories
 */
export declare function useListCategories<TData = Awaited<ReturnType<typeof listCategories>>, TError = ErrorType<unknown>>(params?: ListCategoriesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCategories>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateCategoryUrl: () => string;
export declare const createCategory: (createCategoryBody: CreateCategoryBody, options?: RequestInit) => Promise<Category>;
export declare const getCreateCategoryMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCategory>>, TError, {
        data: BodyType<CreateCategoryBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createCategory>>, TError, {
    data: BodyType<CreateCategoryBody>;
}, TContext>;
export type CreateCategoryMutationResult = NonNullable<Awaited<ReturnType<typeof createCategory>>>;
export type CreateCategoryMutationBody = BodyType<CreateCategoryBody>;
export type CreateCategoryMutationError = ErrorType<unknown>;
export declare const useCreateCategory: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCategory>>, TError, {
        data: BodyType<CreateCategoryBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createCategory>>, TError, {
    data: BodyType<CreateCategoryBody>;
}, TContext>;
export declare const getGetCategoryUrl: (id: number) => string;
export declare const getCategory: (id: number, options?: RequestInit) => Promise<Category>;
export declare const getGetCategoryQueryKey: (id: number) => readonly [`/api/categories/${number}`];
export declare const getGetCategoryQueryOptions: <TData = Awaited<ReturnType<typeof getCategory>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCategory>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCategory>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCategoryQueryResult = NonNullable<Awaited<ReturnType<typeof getCategory>>>;
export type GetCategoryQueryError = ErrorType<unknown>;
export declare function useGetCategory<TData = Awaited<ReturnType<typeof getCategory>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCategory>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateCategoryUrl: (id: number) => string;
export declare const updateCategory: (id: number, updateCategoryBody: UpdateCategoryBody, options?: RequestInit) => Promise<Category>;
export declare const getUpdateCategoryMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCategory>>, TError, {
        id: number;
        data: BodyType<UpdateCategoryBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateCategory>>, TError, {
    id: number;
    data: BodyType<UpdateCategoryBody>;
}, TContext>;
export type UpdateCategoryMutationResult = NonNullable<Awaited<ReturnType<typeof updateCategory>>>;
export type UpdateCategoryMutationBody = BodyType<UpdateCategoryBody>;
export type UpdateCategoryMutationError = ErrorType<unknown>;
export declare const useUpdateCategory: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCategory>>, TError, {
        id: number;
        data: BodyType<UpdateCategoryBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateCategory>>, TError, {
    id: number;
    data: BodyType<UpdateCategoryBody>;
}, TContext>;
export declare const getDeleteCategoryUrl: (id: number) => string;
export declare const deleteCategory: (id: number, options?: RequestInit) => Promise<MessageResponse>;
export declare const getDeleteCategoryMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCategory>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteCategory>>, TError, {
    id: number;
}, TContext>;
export type DeleteCategoryMutationResult = NonNullable<Awaited<ReturnType<typeof deleteCategory>>>;
export type DeleteCategoryMutationError = ErrorType<unknown>;
export declare const useDeleteCategory: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCategory>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteCategory>>, TError, {
    id: number;
}, TContext>;
export declare const getReorderCategoriesUrl: () => string;
export declare const reorderCategories: (reorderCategoriesBody: ReorderCategoriesBody, options?: RequestInit) => Promise<MessageResponse>;
export declare const getReorderCategoriesMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reorderCategories>>, TError, {
        data: BodyType<ReorderCategoriesBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof reorderCategories>>, TError, {
    data: BodyType<ReorderCategoriesBody>;
}, TContext>;
export type ReorderCategoriesMutationResult = NonNullable<Awaited<ReturnType<typeof reorderCategories>>>;
export type ReorderCategoriesMutationBody = BodyType<ReorderCategoriesBody>;
export type ReorderCategoriesMutationError = ErrorType<unknown>;
export declare const useReorderCategories: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reorderCategories>>, TError, {
        data: BodyType<ReorderCategoriesBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof reorderCategories>>, TError, {
    data: BodyType<ReorderCategoriesBody>;
}, TContext>;
/**
 * @summary List portfolio works
 */
export declare const getListWorksUrl: (params?: ListWorksParams) => string;
export declare const listWorks: (params?: ListWorksParams, options?: RequestInit) => Promise<WorkListResponse>;
export declare const getListWorksQueryKey: (params?: ListWorksParams) => readonly ["/api/works", ...ListWorksParams[]];
export declare const getListWorksQueryOptions: <TData = Awaited<ReturnType<typeof listWorks>>, TError = ErrorType<unknown>>(params?: ListWorksParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listWorks>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listWorks>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListWorksQueryResult = NonNullable<Awaited<ReturnType<typeof listWorks>>>;
export type ListWorksQueryError = ErrorType<unknown>;
/**
 * @summary List portfolio works
 */
export declare function useListWorks<TData = Awaited<ReturnType<typeof listWorks>>, TError = ErrorType<unknown>>(params?: ListWorksParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listWorks>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateWorkUrl: () => string;
export declare const createWork: (createWorkBody: CreateWorkBody, options?: RequestInit) => Promise<Work>;
export declare const getCreateWorkMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createWork>>, TError, {
        data: BodyType<CreateWorkBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createWork>>, TError, {
    data: BodyType<CreateWorkBody>;
}, TContext>;
export type CreateWorkMutationResult = NonNullable<Awaited<ReturnType<typeof createWork>>>;
export type CreateWorkMutationBody = BodyType<CreateWorkBody>;
export type CreateWorkMutationError = ErrorType<unknown>;
export declare const useCreateWork: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createWork>>, TError, {
        data: BodyType<CreateWorkBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createWork>>, TError, {
    data: BodyType<CreateWorkBody>;
}, TContext>;
export declare const getGetWorkUrl: (id: number) => string;
export declare const getWork: (id: number, options?: RequestInit) => Promise<Work>;
export declare const getGetWorkQueryKey: (id: number) => readonly [`/api/works/${number}`];
export declare const getGetWorkQueryOptions: <TData = Awaited<ReturnType<typeof getWork>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWork>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getWork>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetWorkQueryResult = NonNullable<Awaited<ReturnType<typeof getWork>>>;
export type GetWorkQueryError = ErrorType<unknown>;
export declare function useGetWork<TData = Awaited<ReturnType<typeof getWork>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWork>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateWorkUrl: (id: number) => string;
export declare const updateWork: (id: number, updateWorkBody: UpdateWorkBody, options?: RequestInit) => Promise<Work>;
export declare const getUpdateWorkMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateWork>>, TError, {
        id: number;
        data: BodyType<UpdateWorkBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateWork>>, TError, {
    id: number;
    data: BodyType<UpdateWorkBody>;
}, TContext>;
export type UpdateWorkMutationResult = NonNullable<Awaited<ReturnType<typeof updateWork>>>;
export type UpdateWorkMutationBody = BodyType<UpdateWorkBody>;
export type UpdateWorkMutationError = ErrorType<unknown>;
export declare const useUpdateWork: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateWork>>, TError, {
        id: number;
        data: BodyType<UpdateWorkBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateWork>>, TError, {
    id: number;
    data: BodyType<UpdateWorkBody>;
}, TContext>;
export declare const getDeleteWorkUrl: (id: number) => string;
export declare const deleteWork: (id: number, options?: RequestInit) => Promise<MessageResponse>;
export declare const getDeleteWorkMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteWork>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteWork>>, TError, {
    id: number;
}, TContext>;
export type DeleteWorkMutationResult = NonNullable<Awaited<ReturnType<typeof deleteWork>>>;
export type DeleteWorkMutationError = ErrorType<unknown>;
export declare const useDeleteWork: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteWork>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteWork>>, TError, {
    id: number;
}, TContext>;
export declare const getLikeWorkUrl: (id: number) => string;
export declare const likeWork: (id: number, options?: RequestInit) => Promise<LikeResponse>;
export declare const getLikeWorkMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof likeWork>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof likeWork>>, TError, {
    id: number;
}, TContext>;
export type LikeWorkMutationResult = NonNullable<Awaited<ReturnType<typeof likeWork>>>;
export type LikeWorkMutationError = ErrorType<unknown>;
export declare const useLikeWork: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof likeWork>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof likeWork>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List blog posts
 */
export declare const getListBlogsUrl: (params?: ListBlogsParams) => string;
export declare const listBlogs: (params?: ListBlogsParams, options?: RequestInit) => Promise<BlogListResponse>;
export declare const getListBlogsQueryKey: (params?: ListBlogsParams) => readonly ["/api/blogs", ...ListBlogsParams[]];
export declare const getListBlogsQueryOptions: <TData = Awaited<ReturnType<typeof listBlogs>>, TError = ErrorType<unknown>>(params?: ListBlogsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBlogs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listBlogs>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListBlogsQueryResult = NonNullable<Awaited<ReturnType<typeof listBlogs>>>;
export type ListBlogsQueryError = ErrorType<unknown>;
/**
 * @summary List blog posts
 */
export declare function useListBlogs<TData = Awaited<ReturnType<typeof listBlogs>>, TError = ErrorType<unknown>>(params?: ListBlogsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBlogs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateBlogUrl: () => string;
export declare const createBlog: (createBlogBody: CreateBlogBody, options?: RequestInit) => Promise<Blog>;
export declare const getCreateBlogMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBlog>>, TError, {
        data: BodyType<CreateBlogBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createBlog>>, TError, {
    data: BodyType<CreateBlogBody>;
}, TContext>;
export type CreateBlogMutationResult = NonNullable<Awaited<ReturnType<typeof createBlog>>>;
export type CreateBlogMutationBody = BodyType<CreateBlogBody>;
export type CreateBlogMutationError = ErrorType<unknown>;
export declare const useCreateBlog: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBlog>>, TError, {
        data: BodyType<CreateBlogBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createBlog>>, TError, {
    data: BodyType<CreateBlogBody>;
}, TContext>;
export declare const getGetBlogUrl: (id: number) => string;
export declare const getBlog: (id: number, options?: RequestInit) => Promise<Blog>;
export declare const getGetBlogQueryKey: (id: number) => readonly [`/api/blogs/${number}`];
export declare const getGetBlogQueryOptions: <TData = Awaited<ReturnType<typeof getBlog>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBlog>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getBlog>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetBlogQueryResult = NonNullable<Awaited<ReturnType<typeof getBlog>>>;
export type GetBlogQueryError = ErrorType<unknown>;
export declare function useGetBlog<TData = Awaited<ReturnType<typeof getBlog>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBlog>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateBlogUrl: (id: number) => string;
export declare const updateBlog: (id: number, updateBlogBody: UpdateBlogBody, options?: RequestInit) => Promise<Blog>;
export declare const getUpdateBlogMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateBlog>>, TError, {
        id: number;
        data: BodyType<UpdateBlogBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateBlog>>, TError, {
    id: number;
    data: BodyType<UpdateBlogBody>;
}, TContext>;
export type UpdateBlogMutationResult = NonNullable<Awaited<ReturnType<typeof updateBlog>>>;
export type UpdateBlogMutationBody = BodyType<UpdateBlogBody>;
export type UpdateBlogMutationError = ErrorType<unknown>;
export declare const useUpdateBlog: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateBlog>>, TError, {
        id: number;
        data: BodyType<UpdateBlogBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateBlog>>, TError, {
    id: number;
    data: BodyType<UpdateBlogBody>;
}, TContext>;
export declare const getDeleteBlogUrl: (id: number) => string;
export declare const deleteBlog: (id: number, options?: RequestInit) => Promise<MessageResponse>;
export declare const getDeleteBlogMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteBlog>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteBlog>>, TError, {
    id: number;
}, TContext>;
export type DeleteBlogMutationResult = NonNullable<Awaited<ReturnType<typeof deleteBlog>>>;
export type DeleteBlogMutationError = ErrorType<unknown>;
export declare const useDeleteBlog: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteBlog>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteBlog>>, TError, {
    id: number;
}, TContext>;
export declare const getLikeBlogUrl: (id: number) => string;
export declare const likeBlog: (id: number, options?: RequestInit) => Promise<LikeResponse>;
export declare const getLikeBlogMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof likeBlog>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof likeBlog>>, TError, {
    id: number;
}, TContext>;
export type LikeBlogMutationResult = NonNullable<Awaited<ReturnType<typeof likeBlog>>>;
export type LikeBlogMutationError = ErrorType<unknown>;
export declare const useLikeBlog: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof likeBlog>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof likeBlog>>, TError, {
    id: number;
}, TContext>;
export declare const getListCommentsUrl: (params?: ListCommentsParams) => string;
export declare const listComments: (params?: ListCommentsParams, options?: RequestInit) => Promise<CommentListResponse>;
export declare const getListCommentsQueryKey: (params?: ListCommentsParams) => readonly ["/api/comments", ...ListCommentsParams[]];
export declare const getListCommentsQueryOptions: <TData = Awaited<ReturnType<typeof listComments>>, TError = ErrorType<unknown>>(params?: ListCommentsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listComments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listComments>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCommentsQueryResult = NonNullable<Awaited<ReturnType<typeof listComments>>>;
export type ListCommentsQueryError = ErrorType<unknown>;
export declare function useListComments<TData = Awaited<ReturnType<typeof listComments>>, TError = ErrorType<unknown>>(params?: ListCommentsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listComments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateCommentUrl: () => string;
export declare const createComment: (createCommentBody: CreateCommentBody, options?: RequestInit) => Promise<Comment>;
export declare const getCreateCommentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createComment>>, TError, {
        data: BodyType<CreateCommentBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createComment>>, TError, {
    data: BodyType<CreateCommentBody>;
}, TContext>;
export type CreateCommentMutationResult = NonNullable<Awaited<ReturnType<typeof createComment>>>;
export type CreateCommentMutationBody = BodyType<CreateCommentBody>;
export type CreateCommentMutationError = ErrorType<unknown>;
export declare const useCreateComment: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createComment>>, TError, {
        data: BodyType<CreateCommentBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createComment>>, TError, {
    data: BodyType<CreateCommentBody>;
}, TContext>;
export declare const getDeleteCommentUrl: (id: number) => string;
export declare const deleteComment: (id: number, options?: RequestInit) => Promise<MessageResponse>;
export declare const getDeleteCommentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteComment>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteComment>>, TError, {
    id: number;
}, TContext>;
export type DeleteCommentMutationResult = NonNullable<Awaited<ReturnType<typeof deleteComment>>>;
export type DeleteCommentMutationError = ErrorType<unknown>;
export declare const useDeleteComment: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteComment>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteComment>>, TError, {
    id: number;
}, TContext>;
export declare const getFeatureCommentUrl: (id: number) => string;
export declare const featureComment: (id: number, options?: RequestInit) => Promise<Comment>;
export declare const getFeatureCommentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof featureComment>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof featureComment>>, TError, {
    id: number;
}, TContext>;
export type FeatureCommentMutationResult = NonNullable<Awaited<ReturnType<typeof featureComment>>>;
export type FeatureCommentMutationError = ErrorType<unknown>;
export declare const useFeatureComment: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof featureComment>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof featureComment>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Get featured logos for homepage
 */
export declare const getListFeaturedLogosUrl: () => string;
export declare const listFeaturedLogos: (options?: RequestInit) => Promise<Work[]>;
export declare const getListFeaturedLogosQueryKey: () => readonly ["/api/featured/logos"];
export declare const getListFeaturedLogosQueryOptions: <TData = Awaited<ReturnType<typeof listFeaturedLogos>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFeaturedLogos>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listFeaturedLogos>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListFeaturedLogosQueryResult = NonNullable<Awaited<ReturnType<typeof listFeaturedLogos>>>;
export type ListFeaturedLogosQueryError = ErrorType<unknown>;
/**
 * @summary Get featured logos for homepage
 */
export declare function useListFeaturedLogos<TData = Awaited<ReturnType<typeof listFeaturedLogos>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFeaturedLogos>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Set featured logos (admin)
 */
export declare const getSetFeaturedLogosUrl: () => string;
export declare const setFeaturedLogos: (setFeaturedLogosBody: SetFeaturedLogosBody, options?: RequestInit) => Promise<MessageResponse>;
export declare const getSetFeaturedLogosMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof setFeaturedLogos>>, TError, {
        data: BodyType<SetFeaturedLogosBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof setFeaturedLogos>>, TError, {
    data: BodyType<SetFeaturedLogosBody>;
}, TContext>;
export type SetFeaturedLogosMutationResult = NonNullable<Awaited<ReturnType<typeof setFeaturedLogos>>>;
export type SetFeaturedLogosMutationBody = BodyType<SetFeaturedLogosBody>;
export type SetFeaturedLogosMutationError = ErrorType<unknown>;
/**
 * @summary Set featured logos (admin)
 */
export declare const useSetFeaturedLogos: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof setFeaturedLogos>>, TError, {
        data: BodyType<SetFeaturedLogosBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof setFeaturedLogos>>, TError, {
    data: BodyType<SetFeaturedLogosBody>;
}, TContext>;
/**
 * @summary Get featured projects for homepage
 */
export declare const getListFeaturedProjectsUrl: () => string;
export declare const listFeaturedProjects: (options?: RequestInit) => Promise<Work[]>;
export declare const getListFeaturedProjectsQueryKey: () => readonly ["/api/featured/projects"];
export declare const getListFeaturedProjectsQueryOptions: <TData = Awaited<ReturnType<typeof listFeaturedProjects>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFeaturedProjects>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listFeaturedProjects>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListFeaturedProjectsQueryResult = NonNullable<Awaited<ReturnType<typeof listFeaturedProjects>>>;
export type ListFeaturedProjectsQueryError = ErrorType<unknown>;
/**
 * @summary Get featured projects for homepage
 */
export declare function useListFeaturedProjects<TData = Awaited<ReturnType<typeof listFeaturedProjects>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFeaturedProjects>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get pinned/featured comments
 */
export declare const getListFeaturedCommentsUrl: () => string;
export declare const listFeaturedComments: (options?: RequestInit) => Promise<Comment[]>;
export declare const getListFeaturedCommentsQueryKey: () => readonly ["/api/featured/comments"];
export declare const getListFeaturedCommentsQueryOptions: <TData = Awaited<ReturnType<typeof listFeaturedComments>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFeaturedComments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listFeaturedComments>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListFeaturedCommentsQueryResult = NonNullable<Awaited<ReturnType<typeof listFeaturedComments>>>;
export type ListFeaturedCommentsQueryError = ErrorType<unknown>;
/**
 * @summary Get pinned/featured comments
 */
export declare function useListFeaturedComments<TData = Awaited<ReturnType<typeof listFeaturedComments>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFeaturedComments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get homepage statistics
 */
export declare const getGetStatsUrl: () => string;
export declare const getStats: (options?: RequestInit) => Promise<SiteStats>;
export declare const getGetStatsQueryKey: () => readonly ["/api/stats"];
export declare const getGetStatsQueryOptions: <TData = Awaited<ReturnType<typeof getStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getStats>>>;
export type GetStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get homepage statistics
 */
export declare function useGetStats<TData = Awaited<ReturnType<typeof getStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Track a page visit
 */
export declare const getTrackVisitorUrl: () => string;
export declare const trackVisitor: (options?: RequestInit) => Promise<MessageResponse>;
export declare const getTrackVisitorMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof trackVisitor>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof trackVisitor>>, TError, void, TContext>;
export type TrackVisitorMutationResult = NonNullable<Awaited<ReturnType<typeof trackVisitor>>>;
export type TrackVisitorMutationError = ErrorType<unknown>;
/**
 * @summary Track a page visit
 */
export declare const useTrackVisitor: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof trackVisitor>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof trackVisitor>>, TError, void, TContext>;
/**
 * @summary Request a presigned URL for file upload
 */
export declare const getRequestUploadUrlUrl: () => string;
export declare const requestUploadUrl: (uploadUrlRequest: UploadUrlRequest, options?: RequestInit) => Promise<UploadUrlResponse>;
export declare const getRequestUploadUrlMutationOptions: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
        data: BodyType<UploadUrlRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
    data: BodyType<UploadUrlRequest>;
}, TContext>;
export type RequestUploadUrlMutationResult = NonNullable<Awaited<ReturnType<typeof requestUploadUrl>>>;
export type RequestUploadUrlMutationBody = BodyType<UploadUrlRequest>;
export type RequestUploadUrlMutationError = ErrorType<ErrorEnvelope>;
/**
 * @summary Request a presigned URL for file upload
 */
export declare const useRequestUploadUrl: <TError = ErrorType<ErrorEnvelope>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
        data: BodyType<UploadUrlRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
    data: BodyType<UploadUrlRequest>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map