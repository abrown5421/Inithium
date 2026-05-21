// packages/store/src/lib/base/crud-api-factory.ts
import { EndpointBuilder } from '@reduxjs/toolkit/query';

export const createCrudEndpoints = <T extends { _id: string }, CreateDto, UpdateDto>(
  entityPath: string,
  tagType: string
) => {
  return (builder: EndpointBuilder<any, any, any>) => ({
    createOne: builder.mutation<T, CreateDto>({
      query: (body: CreateDto) => ({
        url: `/${entityPath}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [tagType as any],
    }),

    readOne: builder.query<T, string>({
      query: (id: string) => `/${entityPath}/${id}`,
      providesTags: (_result: any, _error: any, id: string) => [{ type: tagType, id } as any],
    }),

    readMany: builder.query<readonly T[], readonly string[]>({
      query: (ids: readonly string[]) => ({
        url: `/${entityPath}/batch-read`,
        method: 'POST',
        body: { ids },
      }),
      providesTags: (result: any) =>
        result
          ? [...result.map(({ _id }: any) => ({ type: tagType, id: _id })), tagType as any]
          : [tagType as any],
    }),

    updateOne: builder.mutation<T, { id: string; data: UpdateDto }>({
      query: ({ id, data }) => ({
        url: `/${entityPath}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_res: any, _err: any, { id }: any) => [{ type: tagType, id } as any, tagType as any],
    }),

    deleteOne: builder.mutation<T, string>({
      query: (id: string) => ({
        url: `/${entityPath}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res: any, _err: any, id: string) => [{ type: tagType, id } as any, tagType as any],
    }),

    deleteMany: builder.mutation<{ readonly deletedCount: number }, readonly string[]>({
      query: (ids: readonly string[]) => ({
        url: `/${entityPath}/batch-delete`,
        method: 'POST',
        body: { ids },
      }),
      invalidatesTags: [tagType as any],
    }),
  });
};