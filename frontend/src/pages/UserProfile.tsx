import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { User, Edit, Camera, Loader2 } from 'lucide-react';

const profileSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  username: z.string().min(2, "Please enter a valid username"),
  // email: z.string().email("Please enter a valid email"),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const UserProfile = () => {
  const { user, isAuthenticated, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !user) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      username: user?.username || '',
      bio: user?.bio || '',
    },
  });

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the file for upload
      setImageFile(file);
      
      // Create preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true);
      
      // Create a form data object to handle the file upload
      const formData = new FormData();
      
      // Add all form fields to the form data
      Object.keys(data).forEach(key => {
        formData.append(key, data[key as keyof ProfileFormValues] || '');
      });
      
      // Add the image file if one was selected
      if (imageFile) {
        formData.append('avatar', imageFile);
      }
      
      // Send the update to the server
      await updateUserProfile(formData);

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
        variant: "default"
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when canceling edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setPreviewImage(null);
    setImageFile(null);
    form.reset({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      username: user?.username || '',
      bio: user?.bio || '',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Your Profile</h1>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          )}
        </div>

        <div className="bg-zinc-900 rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative">
              <div 
                className="h-32 w-32 bg-zinc-800 rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={handleImageClick}
              >
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt={user.first_name + " " + user.last_name} 
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : user.avatarUrl ? (
                  <img 
                    src={user.avatarUrl} 
                    alt={user.first_name + " " + user.last_name} 
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-zinc-400" />
                )}
              </div>
              {isEditing && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <button 
                    className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full text-black hover:bg-green-600 transition"
                    onClick={handleImageClick}
                    type="button"
                  >
                    <Camera size={16} />
                  </button>
                </>
              )}
            </div>

            {isEditing ? (
              <div className="flex-1 w-full">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Your username" {...field} readOnly />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-zinc-500">Username cannot be changed</p>
                        </FormItem>
                      )}
                    />

                    {/* <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Input placeholder="Tell us about yourself" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2 pt-4">
                      <Button 
                        type="submit" 
                        className="bg-green-500 hover:bg-green-600 text-black"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleCancelEdit}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            ) : (
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <h2 className="text-xl font-semibold">{user.first_name + " " + user.last_name}</h2>
                  <p className="text-zinc-400">{user.email}</p>
                  <p className="text-zinc-500">@{user.username}</p>
                </div>
                
                <div className="border-t border-zinc-800 pt-4">
                  <h3 className="text-sm text-zinc-400 mb-2">Bio</h3>
                  <p className="text-zinc-300">
                    {user.bio || "No bio added yet."}
                  </p>
                </div>

                <div className="border-t border-zinc-800 pt-4">
                  <h3 className="text-sm text-zinc-400 mb-2">Account Stats</h3>
                  <div className="flex gap-4">
                    <div>
                      <span className="text-lg font-semibold">0</span>
                      <span className="text-zinc-400 ml-1">Playlists</span>
                    </div>
                    <div>
                      <span className="text-lg font-semibold">0</span>
                      <span className="text-zinc-400 ml-1">Friends</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;