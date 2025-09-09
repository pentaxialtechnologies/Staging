export default function Unauthorized() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <a href="/login" style={{ color: 'blue' }}>Go to Login</a>
    </div>
  )
}
