export const queryKeys = {
  folders: {
    root: ['folders', 'root'] as const,
    content: (id: string) => ['folders', id] as const,
    breadcrumb: (id: string) => ['folders', id, 'breadcrumb'] as const,
  },
  shares: {
    list: (fileId: string) => ['shares', fileId] as const,
    all: ['shares', 'all'] as const,
  },
} as const;
