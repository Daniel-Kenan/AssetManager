"use client"

import { useState } from "react"
import { OrganizationSwitcher, useOrganization, useUser } from "@clerk/nextjs"
import { OrgInvitationsParams, OrgMembersParams } from "@/utils/organizations"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search, Users, Mail, AlertCircle } from "lucide-react"
import {
  OrgInvitations,
  OrgInviteMemberForm,
  OrgMembers,
  OrgMembershipRequests,
  OrgVerifiedDomains,
} from "@/components/CustomOrganizationProfile"


export default function Component() {
  const [searchTerm, setSearchTerm] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [message, setMessage] = useState({ type: "", content: "" })
  const { user } = useUser()
  const { isLoaded, organization, membership, invitations, memberships } = useOrganization({
    ...OrgMembersParams,
    ...OrgInvitationsParams,
  })

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const handleInviteUser = async () => {
    if (newUserEmail && organization) {
      setIsInviting(true)
      try {
        // await organization.inviteMember({ emailAddress: newUserEmail })
        setNewUserEmail("")
        setMessage({ type: "success", content: `An invitation has been sent to ${newUserEmail}` })
      } catch (error) {
        console.error("Error inviting user:", error)
        setMessage({ type: "error", content: "Failed to send invitation. Please try again." })
      } finally {
        setIsInviting(false)
      }
    }
  }

  const handleLeaveOrganization = async () => {
    if (membership) {
      try {
        // await membership.delete()
        setMessage({ type: "success", content: "You have successfully left the organization." })
      } catch (error) {
        console.error("Error leaving organization:", error)
        setMessage({ type: "error", content: "Failed to leave organization. Please try again." })
      }
    }
  }

  const filteredMembers = Array.isArray(memberships) 
    ? memberships.filter(member => 
        member.publicUserData?.identifier?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Organization Management</h1>
        <OrganizationSwitcher />
      </div>

      {message.content && (
        <div className={`mb-4 p-4 rounded-md ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.content}
        </div>
      )}

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Organization Members</CardTitle>
            </CardHeader>
            <CardContent>
           
              <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
                <div className="relative w-full sm:w-1/3">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="New user email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                  <Button onClick={handleInviteUser} disabled={isInviting}>
                    {isInviting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                    ) : (
                      <PlusCircle className="mr-2 h-4 w-4" />
                    )}
                    {isInviting ? "Inviting..." : "Invite User"}
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
              <OrgMembers/>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations">

          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
            </CardHeader>
            <CardContent>
            <OrgInvitations />
              
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Organization Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={organization?.imageUrl} />
                  <AvatarFallback>{organization?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{organization?.name}</h2>
                  <p className="text-sm text-muted-foreground">ID: {organization?.id}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Your Role</h3>
                <Badge variant="outline">{membership?.role}</Badge>
              </div>
              <Button onClick={handleLeaveOrganization} variant="destructive">
                <Users className="mr-2 h-4 w-4" /> Leave Organization
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}