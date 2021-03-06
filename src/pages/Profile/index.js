import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input } from '@rocketseat/unform';

import { signOut } from '~/store/modules/auth/actions';
import { updateProfileRequest } from '~/store/modules/user/actions';

import AvatarInput from './AvatarInput';

import { Container } from './styles';

export default function Profile() {
  const profile = useSelector(state => state.user.profile);
  const dispatch = useDispatch();

  function handleSubmit(data){
    dispatch(updateProfileRequest(data));
  }

  function handleSignOut() {
    dispatch(signOut());
  }

  return (
    <Container>
      <Form initialData={profile} onSubmit={handleSubmit}>
        <AvatarInput name="avatar_id"/>

        <Input name="name" placeholder="Nome Completo" />
        <Input name="email" type="email" placeholder="Seu endereço de e-mail" />

        <hr/>

        <Input name="oldPassword" type="password" placeholder="Sua Senha atual" />
        <Input name="password" type="password" placeholder="Nova Senha" />
        <Input name="confirmPassword" type="password" placeholder="Confirmação de Senha" />

        <button type="submit">Atualizar Perfil</button>
      </Form>

      <button type="button" onClick={handleSignOut}>LogOut</button>
    </Container>
  );
}
