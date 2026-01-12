export const login = async (email: string, password: string) => {
  const res = await fetch("http://localhost:4000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });


  if (!res.ok) {
    throw new Error( "Login failed");
  }

  console.log('Working');

  return res;
};