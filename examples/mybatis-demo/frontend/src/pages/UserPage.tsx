import { useCallback, useEffect, useState } from 'react';

type User = {
  id: number;
  username: string;
  age: number;
  email: string;
};

type PageResult = {
  records: User[];
  total: number;
  pageNum: number;
  pageSize: number;
  pages: number;
};

async function fetchPage(pageNum: number, pageSize: number): Promise<PageResult> {
  const res = await fetch(`/api/user/page?pageNum=${pageNum}&pageSize=${pageSize}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = await res.json();
  return body as PageResult;
}

/** 用户管理页面：分页列表 + 删除，对应后端 MyBatis-Plus 分页接口 */
export default function UserPage() {
  const [list, setList] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const pageSize = 5;

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchPage(pageNum, pageSize);
      setList(data.records);
      setTotal(data.total);
      setPages(data.pages);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [pageNum]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('确认删除该用户？')) return;
    await fetch(`/api/user/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <main style={{ padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <h2>用户管理（MyBatis-Plus + React）</h2>

      {loading && <p>加载中…</p>}
      {error && <p style={{ color: 'crimson' }}>出错了：{error}</p>}

      <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>年龄</th>
            <th>邮箱</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.username}</td>
              <td>{item.age}</td>
              <td>{item.email}</td>
              <td>
                <button onClick={() => handleDelete(item.id)}>删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem' }}>
        <button disabled={pageNum <= 1} onClick={() => setPageNum((p) => p - 1)}>
          上一页
        </button>
        <span style={{ margin: '0 1rem' }}>
          第 {pageNum} / {pages} 页 · 共 {total} 条
        </span>
        <button disabled={pageNum >= pages} onClick={() => setPageNum((p) => p + 1)}>
          下一页
        </button>
      </div>
    </main>
  );
}
