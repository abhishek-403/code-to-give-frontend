import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import useLanguage from '@/lib/hooks/useLang';

interface User {
  id: number;
  name: string;
  email: string;
  profilePicture: string;
  role: string;
  volunteerHistory: string[];
  skills: string[];
}

const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate(); //use navigate hook
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setTimeout(() => {
          const mockUser: User = {
            id: 1,
            name: 'Abhishek Sharma',
            email: 'abhishek605404@gmail.com',
            profilePicture: 'https://via.placeholder.com/150',
            role: 'volunteer',
            volunteerHistory: ['Event 1', 'Event 2'],
            skills: ['Web Development', 'Public Speaking'],
          };
          setUser(mockUser);
          setEditedUser(mockUser);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load user profile';
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!editedUser) return;
    setUser(editedUser);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedUser) return;
    setEditedUser({ 
      ...editedUser, 
      [e.target.name]: e.target.value 
    });
  };
  const { t } = useLanguage()

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4" aria-live="polite" aria-busy="true">
        <h1 className="text-3xl font-bold mb-8">{t("User_Profile")}</h1>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="w-32 h-32 rounded-full" />
            <div className="space-y-6 w-full">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4" role="alert">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">{t("error")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">{t("retry")}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4" role="alert">
        <Card>
          <CardContent className="py-10">
            <p className="text-center text-gray-500">{t("no_user_data_available_")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">{t("User_Profile")}</h1>
      <div className="grid gap-6">
        <Card className="overflow-hidden">          
          <div className="px-6 p-6">
            <div className="flex flex-col  md:flex-row gap-4 md:gap-8 items-start md:items-end">
              <Avatar className="w-24 h-24 border-4 border-white rounded-full shadow-md">
                <AvatarImage src="https://github.com/shadcn.png" alt={`${user.name}'s profile`} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-grow">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-gray-500">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>

              </div>
              <div className='flex gap-2'>

                <Button 
                  // onClick={handleEdit}
                  onClick={() => navigate("/", { state: { activeTab: "myApplications" } })}
                  variant="outline"
                  // className="ml-1"
                  aria-label="show current events"
                >{t("Current_Events")}</Button>
              <Button 
                  // onClick={handleEdit}
                  onClick={() => navigate("/", { state: { activeTab: "history" } })}
                  variant="outline"
                  // className="ml-1"
                  aria-label="show user events history"
                >{t("Events_History")}</Button>

              {!isEditing && (
                <Button 
                  onClick={handleEdit}
                  variant="outline"
                  className="bg-gray-700 text-white hover:bg-black hover:text-white"
                  aria-label="Edit profile information"
                >{t("Edit_Profile")}</Button>
              )}
              </div>
               
            </div>
          </div>
          
          <CardContent className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">{t("personal_information")}</h3>
            
            {isEditing ? (
              <form className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("name")}</Label>
                  <Input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={editedUser?.name || ''} 
                    onChange={handleChange} 
                    className="w-full"
                    aria-required="true"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={editedUser?.email || ''} 
                    onChange={handleChange} 
                    className="w-full"
                    aria-required="true"
                  />
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSave}>{t("save_changes")}</Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                  >{t("cancel")}</Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 max-w-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 border-b pb-2">
                  <span className="text-gray-500">{t("name")}</span>
                  <span className="md:col-span-2 font-medium">{user.name}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 border-b pb-2">
                  <span className="text-gray-500">{t("email")}</span>
                  <span className="md:col-span-2 font-medium">{user.email}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* {user.role === 'volunteer' && (
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Volunteer History</h3>
                {user.volunteerHistory.length > 0 ? (
                  <ul className="space-y-2">
                    {user.volunteerHistory.map((event, index) => (
                      <li key={index} className="flex">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                          {index + 1}
                        </div>
                        <div className="flex items-center">{event}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No volunteer history recorded.</p>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Skills</h3>
                {user.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No skills listed.</p>
                )}
              </div>
            </CardContent>
          </Card>
        )} */}
      </div>
    </main>
  );
};

export default UserProfilePage;