import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { UserRole } from "@/lib/constants/server-constants";
import { auth } from "@/lib/firebaseConfig";
import { useDebounce } from "@/lib/hooks/useDebounce";
import useLanguage from "@/lib/hooks/useLang";
import { useChangeUserRoleMutation, useInfiniteUsers } from "@/services/user";
import Loader from "@/utils/loader";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

interface User {
  _id: string;
  displayName: string;
  email: string;
  role: string;
}

const ChangeUserRole: React.FC = () => {
  // const [users, setUsers] = useState<User[]>([
  //   {
  //     _id: "1",
  //     displayName: "John Doe",
  //     email: "john.doe@example.com",
  //     role: "USER",
  //   },
  //   {
  //     _id: "2",
  //     displayName: "Jane Smith",
  //     email: "jane.smith@example.com",
  //     role: "ADMIN",
  //   },
  //   {
  //     _id: "3",
  //     displayName: "Alice Johnson",
  //     email: "alice.johnson@example.com",
  //     role: "VOLUNTEER",
  //   },
  //   {
  //     _id: "4",
  //     displayName: "Bob Brown",
  //     email: "bob.brown@example.com",
  //     role: "WEBMASTER",
  //   },
  // ]);
  const [search, setSearch] = useState<string>("");
  const debouncedSearchQuery = useDebounce(search, 500);
  const { t } = useLanguage();
  const { data, fetchNextPage, hasNextPage, refetch, isLoading, error } =
    useInfiniteUsers({ searchQuery: debouncedSearchQuery });
  const { ref } = useInView({
    threshold: 1,
    onChange: (inView) => inView && hasNextPage && fetchNextPage(),
  });
  const [user] = useAuthState(auth);
  useEffect(() => {
    refetch();
  }, [debouncedSearchQuery, refetch, user]);

  const users = data?.pages.flatMap((page) => page.users) || [];

  const [selectedRoles, setSelectedRoles] = useState<{ [key: string]: string }>(
    {}
  );
  const { mutate, isPending: roleUpdateLoading } = useChangeUserRoleMutation();
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      mutate({ userId, newRole });

      // setUsers((prevUsers) =>
      //   prevUsers.map((user) =>
      //     user._id === userId ? { ...user, role: newRole } : user
      //   )
      // );
    } catch (error) {
      console.error("Error updating role:", error);
      //   alert("Failed to update role.");
    }
  };

  const handleRoleSelect = (userId: string, role: string) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [userId]: role,
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Link to="/admin" className="text-primary-600">
        <Button variant="outline" className="mb-4">
          <ArrowLeft size={16} />
          {t("back_to_dashboard")}
        </Button>
      </Link>
      {/* Page Header */}
      <Card className="border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold ">
            {t("manage_user_roles")}
          </CardTitle>
        </CardHeader>
      </Card>
      {/* Volunteer and Webmaster Count */}
      <Card>
        <CardContent className="flex justify-between items-center pt-4">
          {/* <div className="text-md font-semibold text-gray-700">
            {t("registered_volunteers_")}
            <span className="text-blue-500">{volunteerCount}</span>
          </div>
          <div className="text-md font-semibold text-gray-700">
            {t("registered_webmasters_")}
            <span className="text-green-500">{webmasterCount}</span>
          </div> */}
        </CardContent>
      </Card>
      {/* Search Bar */}
      <Card className="  my-2 pt-2">
        <CardContent className="pt-3 backdrop-blur-xl flex justify-center items-center space-x-3">
          <Input
            type="text"
            placeholder="Search by name "
            value={search}
            autoComplete="off"
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-neutral-80"
          />
          <Button
            // onClick={() => handleRoleChange(user._id, user.role)}
            className="bg-gray-800 hover:bg-black text-white"
          >
            {t("find")}
          </Button>
        </CardContent>
      </Card>
      {/* User Table */}
      <Card>
        <CardContent className="mt-5">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>{t("name")}</TableHeaderCell>
                <TableHeaderCell>{t("email")}</TableHeaderCell>
                <TableHeaderCell>{t("current_role")}</TableHeaderCell>
                <TableHeaderCell>{t("change_role")}</TableHeaderCell>
                <TableHeaderCell>{t("action")}</TableHeaderCell>
              </TableRow>
            </TableHead>
            <tbody className="w-full">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    {t("loading_")}
                  </TableCell>
                </TableRow>
              ) : users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.displayName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className="badge">{user.role}</span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={selectedRoles[user._id] || user.role}
                        onValueChange={(value) =>
                          handleRoleSelect(user._id, value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(UserRole).map((r) => (
                            <SelectItem value={r} key={r}>
                              {/* {t("volunteer")} */}
                              {r}
                            </SelectItem>
                          ))}
                          {/* <SelectItem value={}>{t("user")}</SelectItem>
                          <SelectItem value="ADMIN">{t("admin")}</SelectItem>
                          <SelectItem value="VOLUNTEER">
                            {t("volunteer")}
                          </SelectItem>
                          <SelectItem value="WEBMASTER">
                            {t("webmaster")}
                          </SelectItem> */}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          handleRoleChange(
                            user._id,
                            selectedRoles[user._id] || user.role
                          )
                        }
                        className="bg-gray-800 hover:bg-black-600 text-white"
                        disabled={roleUpdateLoading}
                      >
                        {t("update")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    {t("no_users_found_")}
                  </TableCell>
                </TableRow>
              )}
              {hasNextPage && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center p-4">
                    <div ref={ref} className="flex justify-center">
                      <Loader />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeUserRole;
