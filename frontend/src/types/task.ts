export type Task= {
    _id: string;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: string | null;
    createdAt?: string;
    updateAt?: string;
};

export type TaskResp= {
    items: Task[];
    total: number;
    page: number;
    limit: number;
    pages: number;
};