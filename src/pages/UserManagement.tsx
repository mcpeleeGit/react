import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { userService } from '../services/userService';
import { UserData } from '../types/user';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 10;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    user_type: 'USER',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers(page, ITEMS_PER_PAGE);
      setUsers(response.data);
      setTotalPages(Math.ceil(response.total / ITEMS_PER_PAGE));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '사용자 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleOpenDialog = async (user?: UserData) => {
    if (user) {
      try {
        const response = await userService.getUser(user.id);
        if (response.status === 'success' && response.data) {
          setEditingUser(response.data);
          setFormData({
            email: response.data.email,
            name: response.data.name,
            user_type: response.data.user_type,
          });
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : '사용자 정보를 불러오는데 실패했습니다.');
        return;
      }
    } else {
      setEditingUser(null);
      setFormData({
        email: '',
        name: '',
        user_type: 'USER',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({
      email: '',
      name: '',
      user_type: 'USER',
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        const response = await userService.updateUser(editingUser.id, formData);
        if (response.status === 'success') {
          toast.success('사용자가 수정되었습니다.');
          fetchUsers();
          handleCloseDialog();
        }
      } else {
        const response = await userService.createUser(formData);
        if (response.status === 'success') {
          toast.success('사용자가 등록되었습니다.');
          fetchUsers();
          handleCloseDialog();
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '작업 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      try {
        const response = await userService.deleteUser(id);
        if (response.status === 'success') {
          toast.success('사용자가 삭제되었습니다.');
          fetchUsers();
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.');
      }
    }
  };

  if (loading) {
    return <Typography>로딩 중...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          사용자 관리
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          사용자 등록
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>이름</TableCell>
              <TableCell>이메일</TableCell>
              <TableCell>권한</TableCell>
              <TableCell>생성일</TableCell>
              <TableCell>작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.user_type}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingUser ? '사용자 수정' : '사용자 등록'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="이름"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="이메일"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              disabled={!!editingUser}
            />
            <FormControl fullWidth>
              <InputLabel>권한</InputLabel>
              <Select
                value={formData.user_type}
                label="권한"
                onChange={(e) => setFormData({ ...formData, user_type: e.target.value })}
              >
                <MenuItem value="USER">일반 사용자</MenuItem>
                <MenuItem value="ADMIN">관리자</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingUser ? '수정' : '등록'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement; 