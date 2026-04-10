const headers = {
  "Content-Type": "application/json",
};

const handleError = (error: any) => {
  return error instanceof Error ? error.message : "Server Unreachable";
};

type ItemProps = {
  itemName: string;
  quantity: number;
  price: number;
  _id: string;
  createdAt: string;
};

//auth
export async function register(
  fullName: string,
  email: string,
  password: string,
) {
  try {
    const req = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers,
      body: JSON.stringify({ fullName, email, password }),
    });
    if (!req.ok) return { success: false, message: "Something went wrong" };
    const data = await req.json();
    return data;
  } catch (error) {
    return { success: false, message: handleError(error) };
  }
}

export async function login(email: string, password: string) {
  try {
    const req = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers,
      body: JSON.stringify({ email, password }),
    });
    const data = await req.json();
    if (!data.success) return { success: false, message: data.message };
    return data;
  } catch (error) {
    return { success: false, message: handleError(error) };
  }
}

export async function logout() {
  try {
    const req = await fetch("/api/v1/auth/logout", {
      method: "POST",
      headers,
    });
    const data = await req.json();
    if (!data.success) return { success: false, message: data.message };
    return data;
  } catch (error) {
    return { success: false, message: handleError(error) };
  }
}

export async function getUser(userId: string) {
  try {
    const req = await fetch(`/api/v1/util/user?id=${userId}`, {
      method: "GET",
      headers,
    });
    const data = await req.json();
    if (!data.success) return { success: false, message: data.message };
    return data;
  } catch (error) {
    return { success: false, message: handleError(error) };
  }
}
//end of auth

//functionalities

export async function addItem(
  item: string,
  price: number,
  userId: string,
  qty?: number,
) {
  try {
    const req = await fetch("/api/v1/util/items", {
      method: "POST",
      headers,
      body: JSON.stringify({ item, qty, price, userId }),
    });
    const data = await req.json();
    if (!data.success) return { success: false, message: data.message };
    return data;
  } catch (error) {
    return { success: false, message: handleError(error) };
  }
}

export async function deleteItem(itemId: string, userId: string) {
  try {
    const req = await fetch(
      `/api/v1/util/items?id=${itemId}&userId=${userId}`,
      {
        method: "DELETE",
        headers,
      },
    );
    const data = await req.json();
    if (!data.success) return { success: false, message: data.message };
    return data;
  } catch (error) {
    return { success: false, message: handleError(error) };
  }
}

export async function editItem(
  price: number,
  quantity: number,
  itemId: string,
  userId: string,
) {
  try {
    const req = await fetch("/api/v1/util/items", {
      method: "PATCH",
      headers,
      body: JSON.stringify({ price, quantity, itemId, userId }),
    });
    const data = await req.json();
    if (!data.success) return { success: false, message: data.message };
    return data;
  } catch (error) {
    return { success: false, message: handleError(error) };
  }
}

export async function addDebtor(
  fullName: string,
  items: ItemProps[],
  userId:string,
  totalDebt?: number,
) {
  try {
    const req = await fetch("/api/v1/util/debtors", {
      method: "POST",
      headers,
      body: JSON.stringify({ fullName, items, totalDebt, userId }),
    });
    const data = await req.json();
    if (!data.success) return { success: false, message: data.message };
    return data;
  } catch (error) {
    return { success: false, message: handleError(error) };
  }
}

//end of functionalities
