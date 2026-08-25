
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Ticket {
  id: string;
  code: string;
  number: number;
  phoneNumber?: string;
  status: 'available' | 'registered' | 'redeemed';
  createdAt: Date;
  redeemedAt?: Date;
}

export default function Index() {
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: '1', code: 'TKT001', number: 1, status: 'available', createdAt: new Date() },
    { id: '2', code: 'TKT002', number: 2, status: 'registered', phoneNumber: '+251911234567', createdAt: new Date() },
    { id: '3', code: 'TKT003', number: 3, status: 'redeemed', phoneNumber: '+251922345678', redeemedAt: new Date(), createdAt: new Date() },
  ]);

  const [newCode, setNewCode] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState('');

  // Admin: Create ticket
  const handleCreateTicket = () => {
    if (!newCode.trim() || !newNumber.trim()) {
      toast.error('Please fill in both code and number');
      return;
    }

    const ticket: Ticket = {
      id: Date.now().toString(),
      code: newCode,
      number: parseInt(newNumber),
      status: 'available',
      createdAt: new Date(),
    };

    setTickets([...tickets, ticket]);
    setNewCode('');
    setNewNumber('');
    toast.success('Ticket created successfully');
  };

  // Register phone number
  const handleRegisterPhone = (ticketId: string) => {
    if (!phoneInput.trim()) {
      toast.error('Please enter a phone number');
      return;
    }

    setTickets(tickets.map(t =>
      t.id === ticketId
        ? { ...t, phoneNumber: phoneInput, status: 'registered' as const }
        : t
    ));
    setPhoneInput('');
    setSelectedTicket(null);
    toast.success('Phone number registered');
  };

  // Redeem ticket (simulate SMS)
  const handleRedeemTicket = (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    if (!ticket.phoneNumber) {
      toast.error('Phone number not registered');
      return;
    }

    setTickets(tickets.map(t =>
      t.id === ticketId
        ? { ...t, status: 'redeemed' as const, redeemedAt: new Date() }
        : t
    ));

    toast.success(`SMS sent to ${ticket.phoneNumber}: Ticket ${ticket.code} redeemed!`);
  };

  // Delete ticket
  const handleDeleteTicket = (ticketId: string) => {
    setTickets(tickets.filter(t => t.id !== ticketId));
    toast.success('Ticket deleted');
  };

  const availableCount = tickets.filter(t => t.status === 'available').length;
  const registeredCount = tickets.filter(t => t.status === 'registered').length;
  const redeemedCount = tickets.filter(t => t.status === 'redeemed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Ticket Management System</h1>
          <p className="text-slate-600">Manage ticket codes, numbers, and SMS notifications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-white border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Available</div>
            <div className="text-3xl font-bold text-blue-600">{availableCount}</div>
          </Card>
          <Card className="p-6 bg-white border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Registered</div>
            <div className="text-3xl font-bold text-amber-600">{registeredCount}</div>
          </Card>
          <Card className="p-6 bg-white border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Redeemed</div>
            <div className="text-3xl font-bold text-green-600">{redeemedCount}</div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="admin" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-200">
            <TabsTrigger value="admin" className="data-[state=active]:bg-white">Admin Panel</TabsTrigger>
            <TabsTrigger value="tickets" className="data-[state=active]:bg-white">All Tickets</TabsTrigger>
          </TabsList>

          {/* Admin Panel */}
          <TabsContent value="admin" className="space-y-6">
            <Card className="p-8 bg-white border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Ticket</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Ticket Code</label>
                  <Input
                    placeholder="e.g., TKT001"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Ticket Number</label>
                  <Input
                    placeholder="e.g., 1"
                    type="number"
                    value={newNumber}
                    onChange={(e) => setNewNumber(e.target.value)}
                    className="border-slate-300"
                  />
                </div>
                <Button
                  onClick={handleCreateTicket}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Ticket
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Tickets List */}
          <TabsContent value="tickets" className="space-y-4">
            {tickets.length === 0 ? (
              <Card className="p-8 bg-white border-slate-200 text-center">
                <p className="text-slate-600">No tickets created yet</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className="p-6 bg-white border-slate-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Ticket Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-lg font-bold text-slate-900">{ticket.code}</div>
                          <div className="text-sm px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                            #{ticket.number}
                          </div>
                          <div className={`text-xs px-3 py-1 rounded-full font-medium ${
                            ticket.status === 'available' ? 'bg-blue-100 text-blue-700' :
                            ticket.status === 'registered' ? 'bg-amber-100 text-amber-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {ticket.status.toUpperCase()}
                          </div>
                        </div>
                        {ticket.phoneNumber && (
                          <p className="text-sm text-slate-600">📱 {ticket.phoneNumber}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        {ticket.status === 'available' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedTicket(ticket.id)}
                            className="border-slate-300"
                          >
                            Register Phone
                          </Button>
                        )}
                        {ticket.status === 'registered' && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleRedeemTicket(ticket.id)}
                          >
                            Redeem & Send SMS
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTicket(ticket.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Phone Registration Modal */}
                    {selectedTicket === ticket.id && (
                      <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                        <label className="block text-sm font-medium text-slate-700">Enter Phone Number</label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="+251911234567"
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                            className="border-slate-300"
                          />
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleRegisterPhone(ticket.id)}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedTicket(null)}
                            className="border-slate-300"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
