"use client"

import { useOrganization, useUser } from "@clerk/nextjs"
import {
  OrgDomainParams,
  OrgInvitationsParams,
  OrgMembershipRequestsParams,
  OrgMembersParams,
} from "@/utils/organizations"
import { useState } from "react"
import { OrganizationCustomRoleKey } from "@clerk/types"
import { SelectRole } from "@/components/SelectRole"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const OrgMembers = () => {
  const { user } = useUser()
  const { isLoaded, memberships } = useOrganization(OrgMembersParams)

  if (!isLoaded) {
    return <>Loading</>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memberships?.data?.map((mem) => (
            <TableRow key={mem.id}>
              <TableCell>
                {mem.publicUserData.identifier}{" "}
                {mem.publicUserData.userId === user?.id && "(You)"}
              </TableCell>
              <TableCell>{mem.createdAt.toLocaleDateString()}</TableCell>
              <TableCell>
                <SelectRole
                  defaultRole={mem.role}
                  onChange={async (e) => {
                    await mem.update({
                      role: e.target.value as OrganizationCustomRoleKey,
                    })
                    await memberships?.revalidate()
                  }}
                />
              </TableCell>
              <TableCell>
                <Button
                  onClick={async () => {
                    await mem.destroy()
                    await memberships?.revalidate()
                  }}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      
    </>
  )
}

export const OrgInvitations = () => {
  const { isLoaded, invitations, memberships } = useOrganization({
    ...OrgInvitationsParams,
    ...OrgMembersParams,
  })

  if (!isLoaded) {
    return <>Loading</>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Invited</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations?.data?.map((inv) => (
          <TableRow key={inv.id}>
            <TableCell>{inv.emailAddress}</TableCell>
            <TableCell>{inv.createdAt.toLocaleDateString()}</TableCell>
            <TableCell>{inv.role}</TableCell>
            <TableCell>
              <Button
                onClick={async () => {
                  await inv.revoke()
                  await Promise.all([
                    memberships?.revalidate,
                    invitations?.revalidate,
                  ])
                }}
              >
                Revoke
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export const OrgMembershipRequests = () => {
  const { isLoaded, membershipRequests } = useOrganization(
    OrgMembershipRequestsParams
  )

  if (!isLoaded) {
    return <>Loading</>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Requested Access</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {membershipRequests?.data?.map((mem) => (
            <TableRow key={mem.id}>
              <TableCell>{mem.publicUserData.identifier}</TableCell>
              <TableCell>{mem.createdAt.toLocaleDateString()}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex gap-2 mt-4">
        <Button
          disabled={
            !membershipRequests?.hasPreviousPage ||
            membershipRequests?.isFetching
          }
          onClick={() => membershipRequests?.fetchPrevious?.()}
        >
          Previous
        </Button>

        <Button
          disabled={
            !membershipRequests?.hasNextPage || membershipRequests?.isFetching
          }
          onClick={() => membershipRequests?.fetchNext?.()}
        >
          Next
        </Button>
      </div>
    </>
  )
}

export const OrgVerifiedDomains = () => {
  const { isLoaded, domains } = useOrganization(OrgDomainParams)

  if (!isLoaded) {
    return <>Loading</>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Domain</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {domains?.data?.map((domain) => (
            <TableRow key={domain.id}>
              <TableCell>{domain.name}</TableCell>
              <TableCell>
                <Button
                  onClick={async () => {
                    await domain.delete()
                    await domains?.revalidate()
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button
        className="mt-4"
        disabled={!domains?.hasNextPage}
        onClick={() => domains?.fetchNext?.()}
      >
        {domains?.hasNextPage ? "Load more" : "No more to load"}
      </Button>
    </>
  )
}

export const OrgInviteMemberForm = () => {
  const { isLoaded, organization, invitations } =
    useOrganization(OrgInvitationsParams)
  const [emailAddress, setEmailAddress] = useState("")
  const [disabled, setDisabled] = useState(false)

  if (!isLoaded || !organization) {
    return <>Loading</>
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const submittedData = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    ) as {
      email: string | undefined
      role: OrganizationCustomRoleKey | undefined
    }

    if (!submittedData.email || !submittedData.role) {
      return
    }

    setDisabled(true)
    await organization.inviteMember({
      emailAddress: submittedData.email,
      role: submittedData.role,
    })
    await invitations?.revalidate?.()
    setEmailAddress("")
    setDisabled(false)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row items-center gap-2">
      <Input
        name="email"
        type="text"
        placeholder="Email address"
        value={emailAddress}
        onChange={(e) => setEmailAddress(e.target.value)}
        
      />
        <SelectRole fieldName={"role"} />
      <Button type="submit" disabled={disabled}>
        Invite
      </Button>
    </form>
    </div>
  )
}