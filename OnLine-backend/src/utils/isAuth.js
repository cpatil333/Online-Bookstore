export default function isAuth(user) {
  if (!user || user.role !== "ADMIN") {
    throw new Error("unauthorised!");
  }
}
