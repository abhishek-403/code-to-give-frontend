import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableRow, TableCell, TableHeaderCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import useLanguage from "@/lib/hooks/useLang";

interface User {
  _id: string;
  displayName: string;
  email: string;
  role: string;
}

const ChangeUserRole: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { _id: "1", displayName: "John Doe", email: "john.doe@example.com", role: "USER" },
    { _id: "2", displayName: "Jane Smith", email: "jane.smith@example.com", role: "ADMIN" },
    { _id: "3", displayName: "Alice Johnson", email: "alice.johnson@example.com", role: "VOLUNTEER" },
    { _id: "4", displayName: "Bob Brown", email: "bob.brown@example.com", role: "WEBMASTER" },
  ]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Calculate counts for volunteers and webmasters
  const volunteerCount = users.filter((user) => user.role === "VOLUNTEER").length;
  const webmasterCount = users.filter((user) => user.role === "WEBMASTER").length;
  const { t } = useLanguage()

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await axios.put(`/api/users/${userId}/role`, { role: newRole });
      alert("Role updated successfully!");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error updating role:", error);
    //   alert("Failed to update role.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Link to="/admin" className="text-primary-600">
        <Button variant="outline" className="mb-4">
          <ArrowLeft size={16} />{t("back_to_dashboard")}</Button>
      </Link>
      {/* Page Header */}
      <Card className="border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold ">{t("manage_user_roles")}</CardTitle>
        </CardHeader>
      </Card>
      {/* Volunteer and Webmaster Count */}
      <Card>
        <CardContent className="flex justify-between items-center pt-4">
          <div className="text-md font-semibold text-gray-700">{t("registered_volunteers_")}<span className="text-blue-500">{volunteerCount}</span>
          </div>
          <div className="text-md font-semibold text-gray-700">{t("registered_webmasters_")}<span className="text-green-500">{webmasterCount}</span>
          </div>
        </CardContent>
      </Card>
      {/* Search Bar */}
      <Card className="  my-2 pt-2">
              <CardContent className="pt-3 backdrop-blur-xl flex justify-center items-center space-x-3">
          <Input
            type="text"
            placeholder="Search by name, email, or role"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
                  />
                  <Button
                        onClick={() => handleRoleChange(user._id, user.role)}
                        className="bg-gray-800 hover:bg-black text-white"
                      >{t("find")}</Button>
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
            <tbody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">{t("loading_")}</TableCell>
                </TableRow>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.displayName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className="badge">{user.role}</span>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={user.role}
                        onValueChange={(value) => handleRoleChange(user._id, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">{t("user")}</SelectItem>
                          <SelectItem value="ADMIN">{t("admin")}</SelectItem>
                          <SelectItem value="VOLUNTEER">{t("volunteer")}</SelectItem>
                          <SelectItem value="WEBMASTER">{t("webmaster")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleRoleChange(user._id, user.role)}
                        className="bg-gray-800 hover:bg-black-600 text-white"
                      >{t("update")}</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">{t("no_users_found_")}</TableCell>
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