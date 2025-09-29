interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface UserPayload {
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  id?: number;
}

interface CreateUserProps {
  isVisible: boolean;
  handleModalClose: () => void;
  userData?: number | null;
}

export type { User, UserPayload, CreateUserProps };
