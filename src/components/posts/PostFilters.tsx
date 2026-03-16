import { PostFilters as Filters } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

export const PostFilters = ({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (name: keyof Filters, value: string) => void;
}) => (
  <div className="grid gap-4 rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-card md:grid-cols-2 xl:grid-cols-5">
    <Input
      label="Search"
      placeholder="Search posts or keywords"
      value={filters.search || ''}
      onChange={(event) => onChange('search', event.target.value)}
    />
    <Select label="Type" value={filters.type || ''} onChange={(event) => onChange('type', event.target.value)}>
      <option value="">All types</option>
      <option value="LOST">Lost</option>
      <option value="FOUND">Found</option>
    </Select>
    <Input
      label="Category"
      placeholder="Wallet, ID, Laptop"
      value={filters.category || ''}
      onChange={(event) => onChange('category', event.target.value)}
    />
    <Input
      label="Location"
      placeholder="Library, Canteen, Lab"
      value={filters.location || ''}
      onChange={(event) => onChange('location', event.target.value)}
    />
    <Select
      label="Status"
      value={filters.status || ''}
      onChange={(event) => onChange('status', event.target.value)}
    >
      <option value="">All statuses</option>
      <option value="OPEN">Open</option>
      <option value="CLOSED">Closed</option>
    </Select>
  </div>
);
